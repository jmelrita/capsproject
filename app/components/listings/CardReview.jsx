const CardReview = ({ name, content, icon }) => {
    // Check if content count is 0
    if (!content || content.trim().length === 0) {
      return null; // Return null to prevent rendering
    }
  
    return (
      <div className="p-4 shadow-md rounded-md bg-slate-100 bg-zinc-200">
        <h2 className="text-md font-semibold mb-2">{name}</h2>
        <div style={{ height: '100px', margin: 'auto' }}>
          {/* Truncate content if needed */}
          <p className='italic text-gray-600'>
            {content.length > 130 ? content.substring(0, 100) + "..." : content}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2>{icon}</h2>
        </div>
      </div>
    );
  };
  

export default CardReview