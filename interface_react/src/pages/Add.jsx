import { useState } from "react";


export default function Add() {
    const [align, setAlign] = useState([])
    const getAlignments = async (start, end) => {
        const response = await fetch(`http://134.157.57.237:3500/alignment/${start}/${end}`);
        const data = await response.json();
        setAlign(data);
        return data;
    };

    const getAlignAndInsert = async () => {
        const batchSize = 50; // Taille du lot réduite à 50 enregistrements
        // c'est fait... le prochain doit commencer à 440000 - 450000
        for (let i = 475459; i < 505459; i += batchSize) {
            console.log(`Fetching alignments from ${i} to ${i + batchSize - 1}`);
            
            let items = await getAlignments(i, i + batchSize - 1); // Attendre que getAlign renvoie un résultat
            if (items.length > 0) {
                try {
                    // const response = await fetch('http://134.157.57.237:3500/alignment', {
                    const response = await fetch('http://localhost:3500/alignment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(items)
                    });
                    const data = await response.json();
                    console.log(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
    };

    // async function insertAlignment() {
    //     for (const item of align) {
    //         console.log(item);
    //         item.source_id = item.source_id.trim()
    //         item.source_content = item.source_content.trim()
    //         item.source_before = item.source_before.trim()
    //         item.source_after = item.source_after.trim()
    //         item.source_title = item.source_title.trim()
    //         item.source_author = item.source_author.trim()
    //         item.source_year = item.source_year.trim()
    //         item.target_id = item.target_id.trim()
    //         item.target_content = item.target_content.trim()
    //         item.target_before = item.target_before.trim()
    //         item.target_after = item.target_after.trim()
    //         item.target_title = item.target_title.trim()
    //         item.target_author = item.target_author.trim()
    //         item.target_year = item.target_year.trim()
    //         item.target_year = item.target_year.trim()
    //         try {
    //             const response = await fetch('http://134.157.57.237:3500/alignment', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify(item)
    //             });

    //             if (response.ok) {
    //                 const data = await response.json();
    //                 console.log(data);
    //             } else {
    //                 console.error('Failed to fetch:', response.statusText);
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     }
    // }

    const truncate = async () => {
        try {
            // const response = await fetch('http://134.157.57.237:3500/truncate')
            const response = await fetch('http://134.157.57.237:3500/truncate')
            const data = await response.json()
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="p-5 flex gap-5">
            {/* <button className="btn btn-primary" onClick={insertAlignment}>INSERT INTO ALIGNMENT</button> */}
            {/* <button className="btn btn-primary" onClick={truncate}>TRUNCATE ALIGNMENT</button> */}
            <button className="btn btn-primary" onClick={getAlignAndInsert}>GET AND INSERT</button>
        </div>
    )
}
