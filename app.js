// Create Icon components
const { Search, ExternalLink, Calendar, Tag, ArrowRight } = lucide;

const CSVToJSON = (csv) => {
  try {
    const lines = csv.split('\n');
    const headers = ['id', 'date', 'text', 'category'];
    
    return lines.slice(1).map(line => {
      if (!line.trim()) return null;
      
      const values = line.split(',');
      const entry = {};
      headers.forEach((header, index) => {
        if (header === 'text') {
          entry[header] = values.slice(2, -1).join(',');
        } else if (header === 'category') {
          entry[header] = values[values.length - 1].trim();
        } else {
          entry[header] = values[index];
        }
      });
      return entry;
    }).filter(entry => entry && entry.id && entry.date && entry.text && entry.category);
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
};

const AIContentApp = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [content, setContent] = React.useState([]);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const categories = [
    { name: 'כלי בינה', color: 'bg-blue-500', icon: '🛠️' },
    { name: 'עדכונים', color: 'bg-green-500', icon: '📢' },
    { name: 'מדריכים', color: 'bg-yellow-500', icon: '📚' },
    { name: 'קורסים', color: 'bg-purple-500', icon: '🎓' },
    { name: 'סדנאות', color: 'bg-red-500', icon: '👨‍🏫' },
    { name: 'שונות', color: 'bg-gray-500', icon: '📌' },
    { name: 'אפלקציות', color: 'bg-pink-500', icon: '📱' }
  ];

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('./data.csv');
        
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        const parsedContent = CSVToJSON(csvText);
        
        if (parsedContent.length === 0) {
          throw new Error('No valid content found in CSV file');
        }
        
        setContent(parsedContent);
        setError(null);
      } catch (err) {
        setError(`שגיאה בטעינת התוכן: ${err.message}`);
        console.error('Error loading content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const extractUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL');
  };

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        React.createElement('span', { key: index, className: 'bg-yellow-200' }, part) : part
    );
  };

  const sortedAndFilteredContent = content
    .filter(item => 
      (selectedCategory ? item.category === selectedCategory : true) &&
      (searchTerm ? item.text.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const ContentCard = ({ item }) => {
    const urls = extractUrls(item.text);
    
    return (
      React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center' },
        React.createElement('div', { className: 'flex justify-center items-center mb-3 space-x-4 space-x-reverse' },
          React.createElement('span', { className: 'flex items-center text-sm text-gray-500' },
            React.createElement(Calendar, { className: 'w-4 h-4 ml-1' }),
            formatDate(item.date)
          ),
          React.createElement('span', { className: 'flex items-center text-sm text-gray-500' },
            React.createElement(Tag, { className: 'w-4 h-4 ml-1' }),
            item.category
          )
        ),
        React.createElement('p', { className: 'text-gray-700 mb-4 leading-relaxed' },
          highlightSearchTerm(item.text)
        ),
        urls.length > 0 && React.createElement('div', { className: 'space-y-2 flex flex-col items-center' },
          urls.map((url, index) => 
            React.createElement('a', {
              key: index,
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'flex items-center text-blue-500 hover:text-blue-600 transition-colors'
            },
              React.createElement(ExternalLink, { className: 'w-4 h-4 ml-1' }),
              `קישור ${index + 1}`
            )
          )
        )
      )
    );
  };

  if (isLoading) {
    return React.createElement('div', { className: 'min-h-screen flex justify-center items-center' },
      React.createElement('div', { className: 'text-2xl text-gray-600' }, 'טוען תכנים...')
    );
  }

  if (error) {
    return React.createElement('div', { className: 'min-h-screen flex justify-center items-center' },
      React.createElement('div', { className: 'text-xl text-red-600' }, error)
    );
  }

  return React.createElement('div', { className: 'min-h-screen bg-gray-50 p-4 md:p-8 rtl' },
    React.createElement('div', { className: 'max-w-7xl mx-auto text-center' },
      // Header
      React.createElement('header', { className: 'mb-12' },
        React.createElement('h1', { className: 'text-4xl font-bold text-gray-900 mb-4' }, 'בינה מלאכותית עם הנרי'),
        React.createElement('p', { className: 'text-xl text-gray-600' }, 'עדכונים, מדריכים וטיפים שימושיים')
      ),
      
      // Search and Sort
      React.createElement('div', { className: 'mb-8 flex flex-col md:flex-row gap-4 justify-center items-center' },
        React.createElement('div', { className: 'relative w-full md:w-2/3' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'חיפוש בתכנים...',
            className: 'w-full p-4 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center',
            onChange: (e) => setSearchTerm(e.target.value),
            value: searchTerm
          }),
          React.createElement(Search, {
            className: 'absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400',
            size: 20
          })
        ),
        React.createElement('button', {
          className: 'px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto',
          onClick: () => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
        }, sortOrder === 'desc' ? 'מהחדש לישן' : 'מהישן לחדש')
      ),

      // Content
      !selectedCategory ?
        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8' },
          categories.map(category =>
            React.createElement('button', {
              key: category.name,
              className: `${category.color} text-white p-6 rounded-lg cursor-pointer hover:opacity-90 transition-all transform hover:scale-105 flex flex-col items-center justify-center`,
              onClick: () => setSelectedCategory(category.name)
            },
              React.createElement('div', { className: 'text-3xl mb-2' }, category.icon),
              React.createElement('h2', { className: 'text-lg font-bold' }, category.name)
            )
          )
        ) :
        React.createElement('div', null,
          React.createElement('div', { className: 'flex items-center justify-center mb-6' },
            React.createElement('button', {
              className: 'flex items-center text-gray-600 hover:text-gray-900',
              onClick: () => setSelectedCategory(null)
            },
              React.createElement(ArrowRight, { className: 'w-5 h-5 ml-1' }),
              'חזרה לקטגוריות'
            ),
            React.createElement('h2', { className: 'text-2xl font-bold mr-4' }, selectedCategory)
          ),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
            sortedAndFilteredContent.map(item =>
              React.createElement(ContentCard, { key: item.id, item: item })
            )
          )
        )
    )
  );
};

// Render the app
ReactDOM.render(
  React.createElement(AIContentApp),
  document.getElementById('root')
);
