function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="h-8 bg-activity-bar flex items-center px-4 text-xs select-none">
        Zest Code - v0.1.0 Alpha
      </header>
      <main className="flex-1 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Workbench Ready</h1>
          <p className="text-gray-500">Layout Engine initializing...</p>
        </div>
      </main>
    </div>
  )
}

export default App