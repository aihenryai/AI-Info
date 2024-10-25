// במקום window.fs.readFile
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
