const FinanceScreen = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Finance Dashboard</h1>
      <div className="grid gap-4">
        <div className="p-4 border border-[var(--border)] rounded-lg">
          <h3 className="font-medium mb-2">Financial Overview</h3>
          <p className="text-sm opacity-75">Your financial data will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceScreen;