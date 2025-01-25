import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import api from '../libs/apiCalls';
import { useStore } from '../store/index';




function Dashboard() {
  const [gadgets, setGadgets] = useState([]);
  const [editingGadget, setEditingGadget] = useState(null);
  const [deletingGadget, setDeletingGadget] = useState(null);
  const [selfDestructingGadget, setSelfDestructingGadget] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSelfDestructDialog, setShowSelfDestructDialog] = useState(false);
  const closeUpdateDialog = () => setShowUpdateDialog(false);
  const closeDeleteDialog = () => setShowDeleteDialog(false);
  const closeSelfDestructDialog = () => setShowSelfDestructDialog(false);
  const newNameRef = useRef(null);
  const confirmationCodeRef = useRef(null);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    fetchGadgets();
  }, []);

  const fetchGadgets = async () => {
    try {
      const response = await api.get('/gadgets');
      const gadgetsWithStyles = Array.isArray(response.data)
        ? response.data.map(gadget => ({
          ...gadget,
          color: getRandomColor(),
          position: getRandomPosition(),
        }))
        : [];
      setGadgets(gadgetsWithStyles);
    } catch (error) {
      console.error('Error fetching gadgets:', error);
    }
  };

  const getRandomColor = () => {
    const neonColors = [
      '#00ff00', // Matrix green
      '#00ffff', // Cyan
      '#ff3300', // Red orange
      '#ff00ff', // Magenta
      '#ffff00', // Yellow
      '#1e90ff', // Dodger blue
        '#ff1493', // Deep pink
        '#00bfff', // Deep sky blue
        '#ff4500', // Orange red
        '#ff8c00', // Dark orange
        '#ff69b4', // Hot pink
        '#00fa9a', // Medium spring green
        '#ff6347', // Tomato
        '#ff00ff', // Fuchsia
        '#ff7f50', // Coral
        '#ff1493', // Deep pink
        '#ff69b4', // Hot pink

        


    ];
    return neonColors[Math.floor(Math.random() * neonColors.length)];
  };

  const getRandomPosition = () => {
    const cardWidth = 320;
    const cardHeight = 380;
    const margin = 40; // Minimum space between cards
    const headerSpace = 120; // Space for header
    const footerSpace = 100; // Space for footer button
  
    // Get actual viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    // Calculate maximum number of columns and rows that can fit
    const columns = Math.floor((viewportWidth - margin) / (cardWidth + margin));
    const rows = Math.floor((viewportHeight - headerSpace - footerSpace) / (cardHeight + margin));
  
    // Calculate available space for distribution
    const horizontalSpace = viewportWidth - (columns * cardWidth);
    const verticalSpace = viewportHeight - headerSpace - footerSpace - (rows * cardHeight);
  
    // Calculate padding between cards
    const columnPadding = horizontalSpace / (columns + 1);
    const rowPadding = verticalSpace / (rows + 1);
  
    // Random grid position with some offset
    const gridColumn = Math.floor(Math.random() * columns);
    const gridRow = Math.floor(Math.random() * rows);
  
    // Base position calculation
    let x = columnPadding + (gridColumn * (cardWidth + columnPadding));
    let y = headerSpace + rowPadding + (gridRow * (cardHeight + rowPadding));
  
    // Add random variation within cell
    x += Math.random() * (columnPadding - margin);
    y += Math.random() * (rowPadding - margin);
  
    // Ensure cards stay within viewport bounds
    x = Math.max(margin, Math.min(x, viewportWidth - cardWidth - margin));
    y = Math.max(headerSpace + margin, Math.min(y, viewportHeight - cardHeight - footerSpace - margin));
  
    // Add final random offset for organic feel
    x += Math.random() * 40 - 20;
    y += Math.random() * 40 - 20;
  
    return { 
      x: Math.floor(x),
      y: Math.floor(y)
    };
  };

  const handleCreateGadget = async () => {
    try {
      const response = await api.post('/gadgets');
      const newGadget = {
        ...response.data,
        color: getRandomColor(),
        position: getRandomPosition(),
      };
      setGadgets(prevGadgets => [...prevGadgets, newGadget]);
    } catch (error) {
      console.error('Error creating gadget:', error);
    }
  };

  const handleUpdateGadget = async (gadgetId) => {
    setEditingGadget(gadgets.find(gadget => gadget.id === gadgetId));
    setShowUpdateDialog(true);
  };

  const confirmUpdateGadget = async () => {
    if (!editingGadget || !newNameRef.current) return;

    const newName = newNameRef.current.value;

    try {
      const response = await api.patch(`/gadgets/${editingGadget.id}`, { name: newName });
      setGadgets(prevGadgets =>
        prevGadgets.map(gadget =>
          gadget.id === editingGadget.id 
            ? {
                ...gadget,
                name: response.data.name,
                color: getRandomColor(), // New color
                position: getRandomPosition(), // New position
              }
            : gadget
        )
      );
      closeUpdateDialog();
      setEditingGadget(null);
    } catch (error) {
      console.error('Error updating gadget:', error);
    }
  };

  const handleDeleteGadget = (gadgetId) => {
    setDeletingGadget(gadgets.find(gadget => gadget.id === gadgetId));
    setShowDeleteDialog(true);
  };

  const confirmDeleteGadget = async () => {
    if (!deletingGadget) return;

    try {
      await api.delete(`/gadgets/${deletingGadget.id}`);
      setGadgets(prevGadgets =>
        prevGadgets.map(gadget =>
          gadget.id === deletingGadget.id
            ? { ...gadget, status: 'Decommissioned', decommissionedAt: new Date() }
            : gadget
        )
      );
      closeDeleteDialog();
      setDeletingGadget(null);
    } catch (error) {
      console.error('Error deleting gadget:', error);
    }
  };

  const handleSelfDestruct = (gadgetId) => {
    setSelfDestructingGadget(gadgets.find(gadget => gadget.id === gadgetId));
    setShowSelfDestructDialog(true);
  };

  const confirmSelfDestruct = async () => {
    if (!selfDestructingGadget || !confirmationCodeRef.current) return;

    // In a real application, you would validate the confirmation code here

    try {
      await api.post(`/gadgets/${selfDestructingGadget.id}/self-destruct`);
      setGadgets(prevGadgets =>
        prevGadgets.map(gadget =>
          gadget.id === selfDestructingGadget.id ? { ...gadget, status: 'Destroyed' } : gadget
        )
      );
      closeSelfDestructDialog();
      setSelfDestructingGadget(null);
    } catch (error) {
      console.error('Error self-destructing gadget:', error);
    }
  };

  const getCardStyle = (gadget) => {
    const baseStyle = {
      '--card-glow-color': `${gadget.color}66`,
      borderColor: gadget.color,
      color: gadget.color,
      transform: 'scale(0.85)',
      position: 'absolute',
      left: `${gadget.position.x}px`,
      top: `${gadget.position.y}px`,
    };

    if (gadget.status === 'Decommissioned') {
      return {
        ...baseStyle,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, transparent 0%, transparent 8px, rgba(0, 0, 0, 0.8) 8px),
          linear-gradient(45deg, transparent 30%, ${gadget.color}15)
        `,
        backgroundSize: '16px 16px, 100% 100%',
        opacity: 0.7,
      };
    }

    if (gadget.status === 'Destroyed') {
      return {
        ...baseStyle,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          ${gadget.color}20 10px,
          ${gadget.color}20 20px
        )`,
        opacity: 0.6,
      };
    }

    return baseStyle;
  };

  // Add background mission animation elements
  const BackgroundAnimation = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Rotating circles */}
        <div className="w-[800px] h-[800px] border-2 border-[#00ff00] rounded-full animate-spin-slow" />
        <div className="absolute w-[600px] h-[600px] border border-[#00ff00] rounded-full animate-reverse-spin" />
        <div className="absolute w-[400px] h-[400px] border border-[#00ff00] rounded-full animate-spin-slow" />
        
        {/* Random dots */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00ff00] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard-bg min-h-screen">
      <BackgroundAnimation />
      
      {/* Scanner Lines Overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9998 }}>
        {/* Horizontal Scanner */}
        <div className="scanner-line-horizontal animate-scan-horizontal" />
        
        {/* Vertical Scanner */}
        <div className="scanner-line-vertical animate-scan-vertical" />
        
        {/* Diagonal Scanner */}
        <div className="scanner-line-diagonal animate-scan-diagonal" />
      </div>

      {/* Header */}
      <div className="fixed top-10 w-full text-center z-50">
        <h1 className="mission-title animate-pulse">
          Mission Control
        </h1>
      </div>

      {/* Engage Button and Log Out Button */}
      <div className="fixed bottom-8 w-full text-center z-50 flex justify-center space-x-4">
        <Button
          onClick={handleCreateGadget}
          className="engage-button relative"
        >
          Engage Gadgets
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff00] to-transparent animate-scan" />
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff00] to-transparent animate-scan-reverse" />
        </Button>
        <Button
          onClick={logout}
          className="engage-button relative"
        >
          Abort Mission
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent animate-scan" />
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff0000] to-transparent animate-scan-reverse" />
        </Button>
      </div>

      {/* Gadget Cards */}
      <div className="absolute inset-0 pt-32 pb-32 isolate"> {/* Added isolate for stacking context */}
        {gadgets.map(gadget => (
          <Card
            key={gadget.id}
            className="gadget-card w-80 group hover:z-50 transition-all duration-300"
            style={getCardStyle(gadget)}
          >
            <CardHeader className="border-b border-current p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold tracking-widest">
                  GADGET {gadget.id.toString().slice(-4)}
                </CardTitle>
                <div className="w-3 h-3 rounded-full bg-current animate-blink" />
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Basic Info - Always Visible */}
              <div className="space-y-2 font-mono transition-all duration-300">
                <p className="text-current">NAME: {gadget.name || 'UNKNOWN'}</p>
                <p className="text-current">STATUS: {gadget.status || 'Active'}</p>
              </div>

              {/* Extended Info & Actions - Updated hover styles */}
              <div className="space-y-4 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-[200px] transition-all duration-500 ease-in-out">
                <p className="text-current">SUCCESS RATE: {gadget.missionSuccessProbability || '100%'}</p>
                
                <div className="space-y-2 pt-2 border-t border-current">
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-transparent border border-current 
                           hover:bg-current/20 text-current hover:text-current transition-colors
                           translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                           transition-all duration-300 delay-100"
                    onClick={() => handleUpdateGadget(gadget.id)}
                  >
                    Change Identity
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-transparent border border-current 
                           hover:bg-current/20 text-current hover:text-current transition-colors
                           translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                           transition-all duration-300 delay-200"
                    onClick={() => handleDeleteGadget(gadget.id)}
                  >
                    Decommission
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-transparent border border-current 
                           hover:bg-current/20 text-current hover:text-current transition-colors
                           translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                           transition-all duration-300 delay-300"
                    onClick={() => handleSelfDestruct(gadget.id)}
                  >
                    Self-Destruct
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Update Dialog */}
      <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <AlertDialogContent className="bg-black/95 border-[#00ff00]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#00ff00]">Update Gadget</AlertDialogTitle>
            <Input 
              ref={newNameRef} 
              className="bg-black/50 border-[#00ff00]/50 text-[#00ff00]"
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#00ff00]/50 text-[#00ff00] hover:bg-[#00ff00]/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUpdateGadget}
              className="bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20"
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-black/85 backdrop-blur-md border border-[#00ff00]">
          <AlertDialogHeader>
            <AlertDialogTitle>Decommission Gadget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decommission {deletingGadget?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGadget}>Decommission</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Self-Destruct Dialog */}
      <AlertDialog open={showSelfDestructDialog} onOpenChange={setShowSelfDestructDialog}>
        <AlertDialogContent className="bg-black/85 backdrop-blur-md border border-[#00ff00]">
          <AlertDialogHeader>
            <AlertDialogTitle>Self-Destruct Gadget</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the confirmation code to self-destruct {selfDestructingGadget?.name}:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input ref={confirmationCodeRef} placeholder="Enter confirmation code" />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeSelfDestructDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSelfDestruct}>Self-Destruct</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Dashboard;