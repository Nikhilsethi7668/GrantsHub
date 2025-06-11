import PropTypes from 'prop-types';

const DescriptionRenderer = ({ indexToRender, data }) => {
  // Helper function to truncate text to 25 words
  const truncateText = (text) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length > 25) {
      return words.slice(0, 25).join(' ') + '...';
    }
    return text;
  };

  const itemsToRender = typeof indexToRender === "number" ? [data[indexToRender]] : data;

  // Check if there's no data or empty array
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <p className="text-gray-500 italic">
        Description Not available please visit website
      </p>
    );
  }

  // Check if itemsToRender is empty or contains only null/undefined items
  if (!itemsToRender || itemsToRender.every(item => !item)) {
    return (
      <p className="text-gray-500 italic">
        Description Not available please visit website
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {itemsToRender?.map((item, index) => {
        if (!item) return null;
        
        switch (item?.type) {
          case "heading":
            return (
              <h2 key={index} className="text-xl font-semibold text-gray-800">
                {item.content}
              </h2>
            );
          case "paragraph":
            return item.content ? (
              <p key={index} className="text-gray-700 leading-relaxed">
                {truncateText(item.content)}
              </p>
            ) : (
              <p key={index} className="text-gray-500 italic">
                Description Not available please visit website
              </p>
            );
          case "list":
            return item.items && item.items.length > 0 ? (
              <ul key={index} className="list-disc list-inside space-y-1 text-gray-700">
                {item.items.map((listItem, i) => (
                  <li key={i}>{truncateText(listItem)}</li>
                ))}
              </ul>
            ) : (
              <p key={index} className="text-gray-500 italic">
                Description Not available please visit website
              </p>
            );
          default:
            return (
              <p key={index} className="text-gray-500 italic">
                Description Not available, please visit website
              </p>
            );
        }
      })}
    </div>
  );
};

DescriptionRenderer.propTypes = {
  indexToRender: PropTypes.number.isRequired,
  data: PropTypes.any,
};

export default DescriptionRenderer;