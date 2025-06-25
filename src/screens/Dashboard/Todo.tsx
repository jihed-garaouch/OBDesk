const TodoScreen = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>
      <div className="space-y-4">
        <div className="p-4 border border-[var(--border)] rounded-lg">
          <h3 className="font-medium mb-2">Tasks</h3>
          <p className="text-sm opacity-75">Your todo items will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default TodoScreen;