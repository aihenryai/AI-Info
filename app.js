const { useState, useEffect } = React;
const { Search, ExternalLink, Calendar, Tag, ArrowRight, MessageSquare, Image, BookOpen, Users } = lucide;

const App = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [messages, setMessages] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [activeTab, setActiveTab] = useState('main');

    const categories = [
        { name: 'כלי בינה מלאכותית', color: 'bg-blue-500', icon: MessageSquare },
        { name: 'מדריכים וסרטונים', color: 'bg-green-500', icon: Image },
        { name: 'קורסים וסדנאות', color: 'bg-purple-500', icon: BookOpen },
        { name: 'קהילה ועדכונים', color: 'bg-yellow-500', icon: Users }
    ];

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const response = await fetch('data.json');
                const data = await response.json();
                setMessages(data.messages);
            } catch (error) {
                console.error('Error loading messages:', error);
                setMessages([]);
            }
        };
        loadMessages();
    }, []);

    const filteredMessages = messages.filter(message => 
        (!selectedCategory || (message.categories && message.categories.includes(selectedCategory))) &&
        (!searchTerm || 
         (message.content && message.content.includes(searchTerm)) || 
         (message.title && message.title.includes(searchTerm)))
    ).sort((a, b) => {
        if (!a.date || !b.date) return 0;
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const TabButton = ({ id, label, isActive }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
                isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    const AboutSection = () => (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">על הנרי והקהילה</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
                הנרי שטאובר, מומחה בינה מלאכותית ויוצר תוכן דיגיטלי. 
                מנהל קהילת לומדים ומלמד כיצד להשתמש בכלי בינה מלאכותית באופן יעיל ומעשי.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-blue-700">קורסים וסדנאות</h3>
                    <ul className="space-y-3 text-gray-600">
                        <li>• קורס Notion מקיף</li>
                        <li>• סדנאות ChatGPT מעשיות</li>
                        <li>• קורס Canva ליצירת תוכן</li>
                    </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-green-700">ערוצי תוכן</h3>
                    <ul className="space-y-3 text-gray-600">
                        <li>• קבוצות WhatsApp ייעודיות</li>
                        <li>• ערוץ YouTube עם מדריכים</li>
                        <li>• מאגר כלים ומדריכים</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">בינה מלאכותית עם הנרי</h1>
                    <p className="text-xl text-gray-600">מאגר תכנים, עדכונים ומדריכים שימושיים</p>
                </header>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-6">
                    <TabButton id="main" label="ראשי" isActive={activeTab === 'main'} />
                    <TabButton id="about" label="אודות" isActive={activeTab === 'about'} />
                </div>

                {activeTab === 'about' ? (
                    <AboutSection />
                ) : (
                    <>
                        {/* Search and Sort */}
                        <div className="mb-8 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="חיפוש בתכנים..."
                                    className="w-full p-4 pr-12 rounded-lg border shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {sortOrder === 'desc' ? 'מהחדש לישן' : 'מהישן לחדש'}
                            </button>
                        </div>

                        {/* Categories Grid */}
                        {!selectedCategory ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {categories.map((category) => {
                                    const IconComponent = category.icon;
                                    return (
                                        <button
                                            key={category.name}
                                            onClick={() => setSelectedCategory(category.name)}
                                            className={`${category.color} text-white p-6 rounded-lg shadow-md hover:opacity-90 transition-all transform hover:scale-105`}
                                        >
                                            <div className="flex justify-center mb-4">
                                                <IconComponent className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-lg font-bold text-center">{category.name}</h3>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center mb-6">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="flex items-center text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                        חזרה לקטגוריות
                                    </button>
                                    <h2 className="text-2xl font-bold mr-4">{selectedCategory}</h2>
                                </div>
                            </div>
                        )}

                        {/* Messages Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {filteredMessages.map((message) => (
                                <div key={message.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <Calendar className="w-4 h-4 ml-2" />
                                            {message.date}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-3">{message.title}</h3>
                                    <p className="text-gray-700 mb-4">{message.summary}</p>
                                    {message.urls && message.urls.length > 0 && (
                                        <div className="space-y-2">
                                            {message.urls.map((url, index) => (
                                                <a
                                                    key={index}
                                                    href={url.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-blue-500 hover:text-blue-600"
                                                >
                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                    {url.text}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
