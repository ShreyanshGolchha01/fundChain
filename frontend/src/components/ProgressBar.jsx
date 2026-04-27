const ProgressBar = ({ raised, goal, status }) => {
  const percent = Math.min(Math.round((raised / goal) * 100), 100);
  
  let colorClass = 'bg-primary';
  if (status === 'failed') {
    colorClass = 'bg-danger';
  } else if (status === 'funded' || percent === 100) {
    colorClass = 'bg-accent';
  } else if (percent < 50) {
    colorClass = 'bg-warning';
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1 font-medium text-gray-700">
        <span>₹{raised.toLocaleString()} raised</span>
        <span className="text-gray-500">{percent}% of ₹{goal.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
