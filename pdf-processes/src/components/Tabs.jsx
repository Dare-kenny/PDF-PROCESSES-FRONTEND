// src/components/Tabs.jsx

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex w-full justify-center">
      <div className="inline-flex bg-[#161b22] border border-[#30363d] rounded-xl p-1">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`px-4 py-1.5 text-sm rounded-lg transition ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-300 hover:bg-[#21262d]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
