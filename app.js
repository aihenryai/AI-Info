import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Calendar, Tag, ArrowRight } from 'lucide-react';

const CSVToJSON = (csv) => {
  const lines = csv.split('\n');
  const headers = ['id', 'date', 'text', 'category'];
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const entry = {};
    headers.forEach((header, index) => {
      if (header === 'text') {
        // Combine all remaining columns as text to handle commas within the text
        entry[header] = values.slice(2, -1).join(',');
      } else if (header === 'category') {
        entry[header] = values[values.length - 1].trim();
      } else {
        entry[header] = values[index];
      }
    });
    return entry;
  }).filter(entry => entry.id && entry.date && entry.text && entry.category); // Filter out invalid entries
};

const AIContentApp = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { name: 'כלי בינה', color: 'bg-blue-500', icon: '🛠️' },
    { name: 'עדכונים', color: 'bg-green-500', icon: '📢' },
    { name: 'מדריכים', color: 'bg-yellow-500', icon: '📚' },
    { name: 'קורסים', color: 'bg-purple-500', icon: '🎓' },
    { name: 'סדנאות', color: 'bg-red-500', icon: '👨‍🏫' },
    { name: 'שונות', color: 'bg-gray-500', icon: '📌' },
    { name: 'אפלקציות', color: 'bg-pink-500', icon: '📱' }
  ];

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/content.csv'); // Update path to your CSV file
        if (!response.ok) throw new Error('Failed to load content');
        
        const csvText = await response.text();
        const parsedContent = CSVToJSON(csvText);
        setContent(parsedContent);
        setError(null);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
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
        <span key={index} className="bg-yellow-200">{part}</span> : part
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
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
        <div className="flex justify-center items-center mb-3 space-x-4 space-x-reverse">
          <span className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 ml-1" />
            {formatDate(item.date)}
          </span>
          <span className="flex items-center text-sm text-gray-500">
            <Tag className="w-4 h-4 ml-1" />
            {item.category}
          </span>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {highlightSearchTerm(item.text)}
        </p>
        {urls.length > 0 && (
          <div className="space-y-2 flex flex-col items-center">
            {urls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4 ml-1" />
                קישור {index + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-2xl text-gray-600">טוען תכנים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 rtl">
      <div className="max-w-7xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">בינה מלאכותית עם הנרי</h1>
          <p className="text-xl text-gray-600">עדכונים, מדריכים וטיפים שימושיים</p>
        </header>

        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              placeholder="חיפוש בתכנים..."
              className="w-full p-4 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? 'מהחדש לישן' : 'מהישן לחדש'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
          <h2 className="text-xl font-semibold mb-4">אודות</h2>
          <p className="mb-4">הנרי שטאובר, מומחה בינה מלאכותית ויוצר תוכן</p>
          <a 
            href="https://taplink.cc/henry.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-500 hover:text-blue-600"
          >
            <span>לכל ערוצי הבינה המלאכותית</span>
            <ExternalLink className="w-4 h-4 mr-1" />
          </a>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`${category.color} text-white p-6 rounded-lg cursor-pointer hover:opacity-90 transition-all transform hover:scale-105 flex flex-col items-center justify-center`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h2 className="text-lg font-bold">{category.name}</h2>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center mb-6">
              <button
                className="flex items-center text-gray-600 hover:text-gray-900"
                onClick={() => setSelectedCategory(null)}
              >
                <ArrowRight className="w-5 h-5 ml-1" />
                חזרה לקטגוריות
              </button>
              <h2 className="text-2xl font-bold mr-4">{selectedCategory}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedAndFilteredContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContentApp;
