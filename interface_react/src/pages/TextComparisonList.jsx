import React, { useState, useEffect } from 'react';

import DiffViewer from 'react-diff-viewer';

export default function TextComparisonList () {
  const [textData, setTextData] = useState([]);
  const [showDiff, setShowDiff] = useState({});
  const [source_author, setSource_author] = useState('')
    const [source_title, setSource_title] = useState('')
    const [source_year, setSource_year] = useState('')
    const [source_content, setSource_content] = useState('')
    const [target_author, setTarget_author] = useState('')
    const [target_title, setTarget_title] = useState('')
    const [target_year, setTarget_year] = useState('')
    const [target_content, setTarget_content] = useState('')



  const ENDPOINT = 'http://134.157.57.237:3500'
  const handlSubmit = async () => {

    // const response = await fetch('passage.json')
    const response = await fetch(`${ENDPOINT}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          source_content,
          source_author,
          source_title,
          source_year,
          target_content,
          target_author,
          target_title,
          target_year
        }
      )
    })
    if (response.ok) {
      const data = await response.json()
      console.log(data);
      setTextData(data)
      // setIsCount(true)
      // setIsLoading(false)
    }
  }
  useEffect(() => {
    // Remplacez cette URL par celle de votre serveur qui récupère les données depuis la base de données MySQL
    handlSubmit()
  }, []);

  const toggleDiff = (id) => {
    console.log('Toggling diff for ID:', id);
    setShowDiff(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
    console.log('Updated showDiff:', showDiff);
  };

  return (
    <div>
      {textData.map((item) => (
        <div key={item.id} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '20px' }}>
              <h3>Source</h3>
              <p><strong>Title:</strong> {item.source_title}</p>
              <p><strong>Author:</strong> {item.source_author}</p>
              <p><strong>Year:</strong> {item.source_year}</p>
              <p><strong>{item.source_before}</strong></p>
              <p>Source Content: {item.source_content}</p>
              
              
               
                
                
               
              
              <p><strong>{item.source_after}</strong></p>
            </div>
            <div style={{ flex: 1 }}>
              <h3>Target</h3>
              <p><strong>Title:</strong> {item.target_title}</p>
              <p><strong>Author:</strong> {item.target_author}</p>
              <p><strong>Year:</strong> {item.target_year}</p>
              <p><strong>{item.target_before}</strong></p>
              <p>Target Content: {item.target_content}</p>
              <p><strong>{item.target_after}</strong></p>
                <DiffViewer
                  oldValue={item.source_content}
                  newValue={item.target_content}
                  splitView={true}
                />
              
            </div>
          </div>
          <button onClick={() => toggleDiff(item.id)}>
            {showDiff[item.id] ? 'Hide Difference' : 'Show Difference'}
          </button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h1>Text Comparison</h1>
      <TextComparisonList />
    </div>
  );
};

