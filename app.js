const AIContentApp = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [content, setContent] = React.useState([]);

  const categories = [
    { name: 'כלי בינה', color: 'bg-blue-500' },
    { name: 'עדכונים', color: 'bg-green-500' },
    { name: 'מדריכים', color: 'bg-yellow-500' },
    { name: 'קורסים', color: 'bg-purple-500' },
    { name: 'סדנאות', color: 'bg-red-500' },
    { name: 'שונות', color: 'bg-gray-500' },
    { name: 'אפלקציות', color: 'bg-pink-500' }
  ];

  React.useEffect(() => {
    fetch('data.csv')
      .then(response => response.text())
      .then(csvData => {
        const rows = csvData.split('\n').slice(1);
        const parsedContent = rows.map(row => {
          // פיצול לפי פסיק, אבל לא בתוך מרכאות כפולות
          const [id, date, text, category] = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          return { 
            id: id.trim(), 
            date: date.trim(), 
            text: text.replace(/^"|"$/g, '').trim(), // הסרת מרכאות מתחילת וסוף הטקסט
            category: category.trim() 
          };
        });
        setContent(parsedContent);
        console.log('Parsed content:', parsedContent); // לבדיקה
      })
      .catch(error => console.error('Error loading CSV:', error));
  }, []);

  const filteredContent = content.filter(item => 
    (selectedCategory ? item.category === selectedCategory : true) &&
    (searchTerm ? item.text.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  return (
    React.createElement('div', { className: "container mx-auto p-4 rtl" },
      React.createElement('h1', { className: "text-3xl font-bold mb-4 text-center" }, "בינה מלאכותית עם הנרי - עדכונים ומדריכים"),
      
      React.createElement('div', { className: "mb-8" },
        React.createElement('div', { className: "relative" },
          React.createElement('input', {
            type: "text",
            placeholder: "חיפוש...",
            className: "w-full p-2 pr-8 border rounded-md",
            onChange: (e) => setSearchTerm(e.target.value)
          }),
          React.createElement('span', { className: "absolute top-2 right-2 text-gray-400" }, "🔍")
        )
      ),

      React.createElement('div', { className: "bg-gray-100 p-4 rounded-md mb-8 text-right" },
        React.createElement('h2', { className: "text-xl font-semibold mb-2" }, "אודות"),
        React.createElement('p', { className: "mb-2" }, "הנרי שטאובר, מומחה בינה מלאכותית ויוצר תוכן"),
        React.createElement('a', {
          href: "https://taplink.cc/henry.ai",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-blue-500 hover:underline flex items-center justify-end"
        }, "קישור לכל ערוצי הבינה המלאכותית שלי")
      ),

      !selectedCategory ?
        React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-8" },
          categories.map((category) => 
            React.createElement('div', {
              key: category.name,
              className: `${category.color} text-white p-8 rounded-md cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center`,
              onClick: () => setSelectedCategory(category.name)
            },
              React.createElement('h2', { className: "text-xl font-bold text-center" }, category.name)
            )
          )
        ) :
        React.createElement(React.Fragment, null,
          React.createElement('h2', { className: "text-2xl font-bold mb-4" }, selectedCategory),
          React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
            filteredContent.map((item) => 
              React.createElement('div', { key: item.id, className: "bg-white p-4 rounded-md shadow" },
                React.createElement('div', { className: "flex justify-between items-center mb-2" },
                  React.createElement('span', { className: "text-sm text-gray-500" }, item.date)
                ),
                React.createElement('p', { className: "text-gray-600 mb-2" }, item.text)
              )
            )
          ),
          React.createElement('button', {
            className: "mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded",
            onClick: () => setSelectedCategory(null)
          }, "חזרה לקטגוריות")
        )
    )
  );
};

ReactDOM.render(React.createElement(AIContentApp), document.getElementById('root'));
