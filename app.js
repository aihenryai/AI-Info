import React, { useState, useEffect } from 'react';
import { Search, ExternalLink } from 'lucide-react';

const AIContentApp = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState([]);

  const categories = [
    { name: 'כלי בינה', color: 'bg-blue-500' },
    { name: 'עדכונים', color: 'bg-green-500' },
    { name: 'מדריכים', color: 'bg-yellow-500' },
    { name: 'קורסים', color: 'bg-purple-500' },
    { name: 'סדנאות', color: 'bg-red-500' },
    { name: 'שונות', color: 'bg-gray-500' },
    { name: 'אפלקציות', color: 'bg-pink-500' }
  ];

  useEffect(() => {
    fetch('data.csv')
      .then(response => response.text())
      .then(csvData => {
        const rows = csvData.split('\n').slice(1);
        const parsedContent = rows.map(row => {
          const [ID ,Date,Text,Category] = row.split(',');
          return { ID ,Date,Text,Category };
        });
        setContent(parsedContent);
      });
  }, []);

  const filteredContent = content.filter(item => 
    (selectedCategory ? item.category === selectedCategory : true) &&
    (searchTerm ? item.text.includes(searchTerm) : true)
  );

  return (
    <div className="container mx-auto p-4 rtl">
      <h1 className="text-3xl font-bold mb-4 text-center">בינה מלאכותית עם הנרי - עדכונים ומדריכים</h1>
      
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="חיפוש..."
            className="w-full p-2 pr-8 border rounded-md"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute top-2 right-2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-md mb-8 text-right">
        <h2 className="text-xl font-semibold mb-2">אודות</h2>
        <p className="mb-2">הנרי שטאובר, מומחה בינה מלאכותית ויוצר תוכן</p>
        <a href="https://taplink.cc/henry.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center justify-end">
          קישור לכל ערוצי הבינה המלאכותית שלי
          <ExternalLink size={16} className="mr-1" />
        </a>
      </div>

      {!selectedCategory ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`${category.color} text-white p-8 rounded-md cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <h2 className="text-xl font-bold text-center">{category.name}</h2>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-md shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
                <p className="text-gray-600 mb-2">{item.text}</p>
              </div>
            ))}
          </div>
          <button
            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => setSelectedCategory(null)}
          >
            חזרה לקטגוריות
          </button>
        </>
      )}
    </div>
  );
};

ReactDOM.render(<AIContentApp />, document.getElementById('root'));
