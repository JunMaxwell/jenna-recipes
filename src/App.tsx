import { useState, useEffect, FC } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  Timestamp,
  setDoc,
  getDoc,
  getDocs,
  deleteField
} from 'firebase/firestore';
import { auth, db, signIn, logOut } from './firebase';
import { Recipe, Household, Category } from './types';
import { 
  extractRecipeFromUrl,
  generateRecipe,
  generateRecipeImage
} from './services/geminiService';
import { 
  Plus, 
  Search, 
  Link as LinkIcon, 
  LogOut, 
  Users, 
  ChefHat, 
  Loader2,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

// Shared Components
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from './ErrorBoundary';

// Household Feature Components
import { 
  CreateHouseholdForm, 
  HouseholdModal, 
  FirstFamilyModal, 
  DemoDisabledModal, 
  DataDeletedModal 
} from './features/households';

// Recipe Feature Components
import { 
  STOCK_RECIPES, 
  RecipeGrid, 
  ViewRecipeModal, 
  RecipeFormModal, 
  ImportRecipeModal, 
  GenerateRecipeModal 
} from './features/recipes';

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// --- Main App Component ---

export const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [householdsLoading, setHouseholdsLoading] = useState(true);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteHouseholdConfirmOpen, setIsDeleteHouseholdConfirmOpen] = useState(false);

  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [aiCategory, setAiCategory] = useState<Category>('Dinner');
  const [aiDetails, setAiDetails] = useState('');

  const [isDemoDisabledModalOpen, setIsDemoDisabledModalOpen] = useState(false);
  const [isDataDeletedModalOpen, setIsDataDeletedModalOpen] = useState(false);
  const [isFirstFamilyModalOpen, setIsFirstFamilyModalOpen] = useState(false);
  const [recipeFormError, setRecipeFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Ensure user profile exists
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', u.uid), {
            displayName: u.displayName || 'Anonymous Chef',
            photoURL: u.photoURL || ''
          });
        }

        // Cleanup old data (older than 24 hours)
        try {
          const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
          let dataDeleted = false;

          const hQuery = query(collection(db, 'households'), where(`members.${u.uid}`, 'in', ['admin', 'member', 'viewer']));
          const hSnapshot = await getDocs(hQuery);
          
          for (const hDoc of hSnapshot.docs) {
            const hData = hDoc.data();
            const createdAt = hData.createdAt?.toMillis?.() || 0;
            
            if (createdAt > 0 && createdAt < twentyFourHoursAgo && hData.ownerId === u.uid && !hData.isStock) {
              try {
                const rQuery = query(collection(db, 'recipes'), where('householdId', '==', hDoc.id));
                const rSnapshot = await getDocs(rQuery);
                for (const rDoc of rSnapshot.docs) {
                  try {
                    await deleteDoc(doc(db, 'recipes', rDoc.id));
                  } catch (e) {
                    console.error("Failed to delete recipe", e);
                  }
                }
                
                await deleteDoc(doc(db, 'households', hDoc.id));
                dataDeleted = true;
              } catch (e) {
                console.error("Failed to delete household", e);
              }
            } else {
              const rQuery = query(collection(db, 'recipes'), where('householdId', '==', hDoc.id));
              const rSnapshot = await getDocs(rQuery);
              for (const rDoc of rSnapshot.docs) {
                const rData = rDoc.data();
                const rCreatedAt = rData.createdAt?.toMillis?.() || 0;
                if (rCreatedAt > 0 && rCreatedAt < twentyFourHoursAgo && !rData.isStock && (rData.authorId === u.uid || hData.ownerId === u.uid)) {
                  try {
                    await deleteDoc(doc(db, 'recipes', rDoc.id));
                    dataDeleted = true;
                  } catch (e) {
                    console.error("Failed to delete recipe", e);
                  }
                }
              }
            }
          }

          if (dataDeleted) {
            setIsDataDeletedModalOpen(true);
          }
        } catch (error) {
          console.error("Error cleaning up old data:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Households
  useEffect(() => {
    if (!user) {
      setHouseholdsLoading(false);
      return;
    }
    setHouseholdsLoading(true);
    const q = query(collection(db, 'households'), where(`members.${user.uid}`, 'in', ['admin', 'member', 'viewer']));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const h = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Household));
      setHouseholds(h);
      setHouseholdsLoading(false);
      if (h.length > 0) {
        setSelectedHousehold(prev => {
          if (!prev) return h[0];
          const updated = h.find(hh => hh.id === prev.id);
          return updated || h[0];
        });
      } else {
        setSelectedHousehold(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'households');
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch Recipes
  useEffect(() => {
    if (!user || !selectedHousehold) {
      setRecipes([]);
      return;
    }
    const q = query(collection(db, 'recipes'), where('householdId', '==', selectedHousehold.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRecipes = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
      fetchedRecipes.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || Date.now();
        const timeB = b.createdAt?.toMillis?.() || Date.now();
        return timeB - timeA;
      });
      setRecipes(fetchedRecipes);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'recipes');
    });
    return () => unsubscribe();
  }, [user, selectedHousehold]);

  const handleCreateHousehold = async (name: string) => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const newH = {
        name,
        ownerId: user.uid,
        members: { [user.uid]: 'admin' },
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'households'), newH);
      
      // Add stock recipes to the new household
      for (const recipe of STOCK_RECIPES) {
        await addDoc(collection(db, 'recipes'), {
          ...recipe,
          authorId: user.uid,
          householdId: docRef.id,
          createdAt: serverTimestamp()
        });
      }

      setSelectedHousehold({ id: docRef.id, ...newH } as Household);
      setIsHouseholdModalOpen(false);
      setIsFirstFamilyModalOpen(true);
    } catch (error) {
      console.error("Error creating household:", error);
      alert("Failed to create household.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteHousehold = async (householdId: string) => {
    if (!user) return;
    try {
      // 1. Delete all recipes in the household
      const rQuery = query(collection(db, 'recipes'), where('householdId', '==', householdId));
      const rSnapshot = await getDocs(rQuery);
      for (const rDoc of rSnapshot.docs) {
        await deleteDoc(doc(db, 'recipes', rDoc.id));
      }
      // 2. Delete the household
      await deleteDoc(doc(db, 'households', householdId));
      
      setIsDeleteHouseholdConfirmOpen(false);
      setIsHouseholdModalOpen(false);
    } catch (error) {
      console.error("Failed to delete household:", error);
      alert("Failed to delete household. Please try again.");
    }
  };

  const handleSaveRecipe = async (recipeData: Partial<Recipe>) => {
    if (!user || !selectedHousehold) return;
    
    // Validation
    if (!recipeData.title?.trim()) {
      setRecipeFormError("Please enter a recipe title.");
      return;
    }
    if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
      setRecipeFormError("Please add at least one ingredient.");
      return;
    }
    if (!recipeData.instructions || recipeData.instructions.length === 0) {
      setRecipeFormError("Please add at least one instruction step.");
      return;
    }

    setRecipeFormError(null);

    // Remove undefined fields to prevent Firestore errors
    const cleanedData = Object.fromEntries(
      Object.entries(recipeData).filter(([_, v]) => v !== undefined)
    );

    try {
      if (editingRecipe?.id) {
        await updateDoc(doc(db, 'recipes', editingRecipe.id), {
          ...cleanedData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'recipes'), {
          ...cleanedData,
          authorId: user.uid,
          householdId: selectedHousehold.id,
          createdAt: serverTimestamp(),
          rating: cleanedData.rating || 0
        });
      }
      setIsAddModalOpen(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      setViewingRecipe(null);
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `recipes/${id}`);
    }
  };

  const handleImport = async () => {
    if (!importUrl) return;
    setIsProcessing(true);
    setImportError(null);
    console.log("Starting import for URL:", importUrl);
    try {
      const extracted = await extractRecipeFromUrl(importUrl);
      console.log("Extracted recipe:", extracted);
      
      const imageUrl = await generateRecipeImage(extracted.title, extracted.category);
      
      // Close import modal first
      setIsImportModalOpen(false);
      
      // Set the editing recipe with temporary fields to satisfy the type
      setEditingRecipe({
        ...extracted,
        id: '', // Temporary ID to indicate it's new but has data
        sourceUrl: importUrl,
        imageUrl: imageUrl || '',
        category: extracted.category as Category || 'Other',
        authorId: user?.uid || '',
        householdId: selectedHousehold?.id || '',
        createdAt: Timestamp.now()
      } as Recipe);
      
      // Open the add modal
      setIsAddModalOpen(true);
      setImportUrl(''); // Clear the URL
    } catch (error) {
      console.error("Import failed:", error);
      setImportError(error instanceof Error ? error.message : "Failed to import recipe. Please check the URL and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateRecipe = async () => {
    setIsProcessing(true);
    try {
      const recipe = await generateRecipe(aiCategory, aiDetails);
      const imageUrl = await generateRecipeImage(recipe.title, aiCategory);
      
      setIsGenerateModalOpen(false);
      
      setEditingRecipe({
        ...recipe,
        category: aiCategory,
        imageUrl: imageUrl || '',
        id: '',
        authorId: user?.uid || '',
        householdId: selectedHousehold?.id || '',
        createdAt: Timestamp.now()
      } as Recipe);
      
      setIsAddModalOpen(true);
      setAiDetails('');
    } catch (error) {
      console.error("Generate failed:", error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!selectedHousehold || !user || selectedHousehold.ownerId !== user.uid) return;
    try {
      const hRef = doc(db, 'households', selectedHousehold.id);
      await updateDoc(hRef, {
        [`members.${userId}`]: 'member'
      });
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add member. Please check the User ID and try again.");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedHousehold || !user || selectedHousehold.ownerId !== user.uid) return;
    if (userId === user.uid) {
      alert("You cannot remove yourself from your own household.");
      return;
    }
    try {
      const hRef = doc(db, 'households', selectedHousehold.id);
      await updateDoc(hRef, {
        [`members.${userId}`]: deleteField()
      });
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member. Please try again.");
    }
  };

  const handleCopyId = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading || (user && householdsLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 font-serif">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-stone-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl rotate-3">
            <ChefHat className="w-10 h-10 text-stone-50" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-stone-900 tracking-tight">Heirloom</h1>
            <p className="text-stone-500 text-lg">Your digital kitchen for family traditions.</p>
          </div>
          <Button onClick={signIn} className="w-full py-4 text-lg shadow-lg">
            Sign in with Google
          </Button>
        </motion.div>
      </div>
    );
  }

  if (households.length === 0) {
    return (
      <CreateHouseholdForm 
        isProcessing={isProcessing}
        onCreateHousehold={handleCreateHousehold}
        onSignOut={logOut}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f5f5f0] dark:bg-stone-950 text-stone-800 dark:text-stone-200 font-sans pb-24 transition-colors duration-300">
        <div id="main-content">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-[#f5f5f0]/80 dark:bg-stone-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-stone-200/50 dark:border-stone-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-800 dark:bg-stone-100 rounded-xl flex items-center justify-center shadow-lg -rotate-6">
                <ChefHat className="w-6 h-6 text-stone-50 dark:text-stone-900" />
              </div>
              <h1 className="text-2xl font-serif font-bold tracking-tight hidden sm:block">Heirloom</h1>
            </div>

            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => setIsDarkMode(prev => !prev)}
                className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 dark:text-stone-400 flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative group">
                <button 
                  onClick={() => setIsHouseholdModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all shadow-sm"
                >
                  <Users className="w-4 h-4 text-stone-400" />
                  <span className="font-medium text-sm text-stone-700 dark:text-stone-200">
                    {selectedHousehold?.name || 'Select Household'}
                  </span>
                </button>
              </div>
              
              <div className="flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-800">
                <img 
                  src={user.photoURL || ''} 
                  referrerPolicy="no-referrer" 
                  className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-800" 
                  alt="Profile" 
                />
                <button onClick={logOut} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors">
                  <LogOut className="w-5 h-5 text-stone-400" />
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            {/* Welcome & Stats */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-1">
                <h2 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">
                  Welcome, {user.displayName?.split(' ')[0]}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 italic">What's cooking today?</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setIsGenerateModalOpen(true)} 
                  className="dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                >
                  <Sparkles className="w-4 h-4" /> AI Recipe
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsImportModalOpen(true)} 
                  className="dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                >
                  <LinkIcon className="w-4 h-4" /> Import URL
                </Button>
                <Button 
                  onClick={() => { setEditingRecipe(null); setIsAddModalOpen(true); }} 
                  className="dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                >
                  <Plus className="w-4 h-4" /> Add Recipe
                </Button>
              </div>
            </section>

            {/* Filters & Search */}
            <section className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 lg:min-w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Search recipes or ingredients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 transition-all text-lg"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as Category | 'All')}
                    className={cn(
                      "px-6 py-4 rounded-2xl whitespace-nowrap font-medium transition-all border",
                      selectedCategory === cat 
                        ? "bg-stone-800 dark:bg-stone-100 text-stone-50 dark:text-stone-900 border-stone-800 dark:border-stone-100 shadow-md" 
                        : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Recipe Grid */}
            <RecipeGrid 
              recipes={filteredRecipes} 
              onSelectRecipe={setViewingRecipe} 
            />
          </main>
        </div>

        {/* Households Modals */}
        <HouseholdModal 
          isOpen={isHouseholdModalOpen}
          onClose={() => setIsHouseholdModalOpen(false)}
          households={households}
          selectedHousehold={selectedHousehold}
          onSelectHousehold={setSelectedHousehold}
          userUid={user.uid}
          isProcessing={isProcessing}
          onCreateHousehold={handleCreateHousehold}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onDeleteHousehold={handleDeleteHousehold}
          copied={copied}
          onCopyId={handleCopyId}
          isDeleteHouseholdConfirmOpen={isDeleteHouseholdConfirmOpen}
          setIsDeleteHouseholdConfirmOpen={setIsDeleteHouseholdConfirmOpen}
        />

        <FirstFamilyModal 
          isOpen={isFirstFamilyModalOpen}
          onClose={() => setIsFirstFamilyModalOpen(false)}
        />

        <DemoDisabledModal 
          isOpen={isDemoDisabledModalOpen}
          onClose={() => setIsDemoDisabledModalOpen(false)}
        />

        <DataDeletedModal 
          isOpen={isDataDeletedModalOpen}
          onClose={() => setIsDataDeletedModalOpen(false)}
        />

        {/* Recipes Modals */}
        <ViewRecipeModal 
          recipe={viewingRecipe}
          onClose={() => { setViewingRecipe(null); setIsDeleteConfirmOpen(false); }}
          onDelete={handleDeleteRecipe}
          onEdit={(recipe) => { setEditingRecipe(recipe); setViewingRecipe(null); setIsAddModalOpen(true); }}
          isDeleteConfirmOpen={isDeleteConfirmOpen}
          setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        />

        <RecipeFormModal 
          isOpen={isAddModalOpen}
          onClose={() => { setIsAddModalOpen(false); setEditingRecipe(null); setRecipeFormError(null); }}
          editingRecipe={editingRecipe}
          recipeFormError={recipeFormError}
          onSaveRecipe={handleSaveRecipe}
        />

        <ImportRecipeModal 
          isOpen={isImportModalOpen}
          onClose={() => { setIsImportModalOpen(false); setImportError(null); }}
          importUrl={importUrl}
          setImportUrl={setImportUrl}
          importError={importError}
          setImportError={setImportError}
          isProcessing={isProcessing}
          onImport={handleImport}
        />

        <GenerateRecipeModal 
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          aiCategory={aiCategory}
          setAiCategory={setAiCategory}
          aiDetails={aiDetails}
          setAiDetails={setAiDetails}
          isProcessing={isProcessing}
          onGenerateRecipe={handleGenerateRecipe}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
