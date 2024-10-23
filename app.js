import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Calendar, Tag, ArrowRight } from 'lucide-react';

const CSVToJSON = (csv) => {
  try {
    const lines = csv.split('\n');
    const headers = ['id', 'date', 'text', 'category'];
    
    return lines.slice(1).map(line => {
      if (!line.trim()) return null; // Skip empty lines
      
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
    }).filter(entry => entry && entry.id && entry.date && entry.text && entry.category); // Filter out invalid entries
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
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
        // Updated path to match your file structure
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

  // ... rest of the component code remains the same ...
};

export default AIContentApp;
