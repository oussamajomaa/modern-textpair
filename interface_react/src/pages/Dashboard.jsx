import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Echart from "../component/Echart";

const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default function Dashboard() {
    const role = localStorage.getItem('role');
    const [alignement, setAlignment] = useState(0)
    const [evaluated, setEvaluated] = useState(0)
    const [oui, setOui] = useState(0)
    const [non, setNon] = useState(0)
    const [douteux, setNotSure] = useState(0)
    const [validated, setValidated] = useState(0)
    const [evaluatedByUser, setEvaluatedByUser] = useState([{}])
    const [evaluatedByValidateur, setEvaluatedByValidateur] = useState([{}])
    const [validateurs, setValidateurs] = useState([])
    const [annotateurs, setAnnotateurs] = useState([])
    const [annotateurDetail, setAnnotateurDetail] = useState({})
    const [username, setUsername] = useState('')
    const [sourceYear, setSourceYear] = useState([])
    const [targetYear, setTargetYear] = useState([])

    const [sourceAuthor, setSourceAuthor] = useState([])
    const [targetAuthor, setTargetAuthor] = useState([])
    
    // Group all chart data in one state object


    const [isLoading, setIsLoading] = useState(true); // Loading state

    // Fetch data from the API and handle errors
    const getData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${ENDPOINT}/dashboard`,{
                credentials:'include'
            })
            if (response.ok) {
                const data = await response.json();
                
                setAlignment(data.alignment)
                setEvaluated(data.evaluated)
                setOui(data.oui)
                setNon(data.non)
                setNotSure(data.douteux)
                setValidated(data.validated)
                setEvaluatedByUser(data.evaluatedByUser)
                setEvaluatedByValidateur(data.evaluatedByValidateur)
                setAnnotateurs(data.annotateur)
                setValidateurs(data.validateur)
                setSourceYear(data.sourceYear)
                setTargetYear(data.targetYear)
                setSourceAuthor(data.sourceAuthor)
                setTargetAuthor(data.targetAuthor)

                setIsLoading(false); // Data is loaded
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setIsLoading(false)
    };

    useEffect(() => {
        getData();
    }, []);

    const getOneAnnotateur = async (id) => {        
        const response = await fetch(`${ENDPOINT}/dashboard/annotateur/${id}`,{
            credentials:'include'
        })
        if (response.ok) {
            const data = await response.json();
            if (data.annotateurDetail) {
                setAnnotateurDetail(data.annotateurDetail[0]); // Par défaut un objet vide si data.annotateurDetail[0] est undefined
                setUsername(data.annotateurDetail[0].email)
            } else {
                setUsername('Aucaun alignement évalué')
            }
        }
    };

    // Function to generate pie chart options to avoid repetition
    const generatePieChartOptions = (title, data) => ({
        title: {
            text: title,
            subtext: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                type: 'pie',
                radius: '50%',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });

    // Define all your chart data here
    const data1 = [
        { value: evaluated, name: 'Évalués' },
        { value: validated, name: 'Validés' }
    ];

    const data2 = [
        { value: oui, name: 'Oui' },
        { value: non, name: 'Non' },
        { value: douteux, name: 'Douteux' }
    ];

    const data3 = [
        { value: alignement, name: 'Non Évalués' },
        { value: evaluated, name: 'Évalués' }
    ];

    const data4 = annotateurDetail
        ? [
            { value: annotateurDetail.correct_count ?? 0, name: 'Oui' }, // Utilise la valeur ou 0 si elle est undefined
            { value: annotateurDetail.non_count ?? 0, name: 'Non' },
            { value: annotateurDetail.pas_sur_count ?? 0, name: 'Douteux' }
        ]
        : [];

   
    const labelSourceYear = []
    sourceYear.map(item => {
        labelSourceYear.push(item.name)
    })
    const labelTargetYear = []
    targetYear.map(item => {
        labelTargetYear.push(item.name)
    })

    const labelSourceAuthor = []
        sourceAuthor.map(item => {
            labelSourceAuthor.push(item.name)
        })
    const labelTargetAuthor = []
        targetAuthor.map(item => {
            labelTargetAuthor.push(item.name)
        })
    const label4 = []
    data4.map(item => {
        label4.push(item.name)
    })


    const labelByUser = []
    evaluatedByUser.map(item => {
        labelByUser.push(item.name)
    })

    const labelByValidateur = []
    evaluatedByValidateur.map(item => {
        labelByValidateur.push(item.name)
    })


    const label1 = ['Validés', 'Évalués']
    const label2 = ['Oui', 'Non', 'Douteux']
    const label3 = ['Non Évalués','Évalués']
    // Bar chart options
    const barChartOptions = (label, data) => ({
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        // dataZoom: [
        //     {
        //       type: 'inside'
        //     }
        //   ],
        xAxis: {
            type: 'category',
            data: label,
        },

        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: data,
                type: 'bar',
                itemStyle: {
                    // Ajoutez les couleurs de fond ici
                    color: function (params) {
                        // Exemple de couleur personnalisée basée sur l'index de la barre
                        const colorList = ['#5C7BD9', '#9FE080', '#FFDC60', '#EE6666', '#5470C6'];
                        return colorList[params.dataIndex % colorList.length];
                    }
                }
            }
        ]
    });

    // const orderBy = async(e) => {
    //     setIsLoading(true)
    //     let order = 'value'
    //     if(e.target.checked){
    //         order = 'value'
    //     } else {
    //         order = 'name'
    //     }
        
    //     const response = await fetch(`${ENDPOINT}/dashboard/${order}`)
    //     if (response.ok) {
    //         const data = await response.json()
           
    //             setSourceYear(data.sourceYear)
    //             setTargetYear(data.targetYear)

    //     }
    //     setIsLoading(false)
    // }


    // const orderByAuthor = async(e) => {
    //     setIsLoading(true)
    //     let order = 'value'
    //     if(e.target.checked){
    //         order = 'value'
    //     } else {
    //         order = 'name'
    //     }
        
    //     const response = await fetch(`${ENDPOINT}/dashboard/${order}`)
    //     if (response.ok) {
    //         const data = await response.json()
           
    //             setSourceAuthor(data.sourceAuthor)
    //             setTargetAuthor(data.targetAuthor)

    //     }
    //     setIsLoading(false)
    // }


    // Redirect to login if not admin
    if (role !== 'Administrateur') {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className="xl:ml-64 max-xl:ml-24 ">

            <div className="flex-grow p-6 bg-gray-100">
                <h1 className="text-3xl font-bold">Tableau de board</h1>
            </div>
            {isLoading && <span className="loading loading-bars loading-lg text-accent block m-auto"></span>}
            {!isLoading && <div className="p-5">
                {/* <h2 className="text-3xl mb-5 text-center font-bold">Comparaison entre alignements évalués et validés</h2>
                <div className="flex justify-between max-xl:flex-col mb-6">
                    <Echart option={generatePieChartOptions('', data1)} />
                    <Echart option={barChartOptions(label1, data1)} />
                </div> */}
                <h2 className="text-3xl mb-5 text-center font-bold">Statut des Alignements Évalués : Oui, Non ou Douteux</h2>
                <div className="flex justify-between max-xl:flex-col mb-6">
                    <Echart option={generatePieChartOptions('', data2)} />
                    <Echart option={barChartOptions(label2, data2)} />
                </div>
                <h2 className="text-3xl mb-5 text-center font-bold">Comparaison entre alignements évalués et non évalués</h2>
                <div className="flex justify-between max-xl:flex-col mb-6">
                    <Echart option={generatePieChartOptions('', data3)} />
                    <Echart option={barChartOptions(label3, data3)} />
                </div>
                <h2 className="text-3xl mb-5 text-center font-bold">Répartition des évaluations par annotateur</h2>
                <div className="flex justify-between max-xl:flex-col mb-6">
                    <Echart option={generatePieChartOptions('', evaluatedByUser)} />
                    <Echart option={barChartOptions(labelByUser, evaluatedByUser)} />
                </div>
                {/* <h2 className="text-3xl mb-5 text-center font-bold">Évaluation par Annotateur</h2>
                <div className="w-1/2">
                    <select
                        className="select select-bordered w-full max-w-xs mb-6"
                        onChange={(e) => getOneAnnotateur(e.target.value)}
                        defaultValue={'DEFAULT'}>
                        <option value="DEFAULT" disabled>Choisir un annotateur</option>
                        
                        {annotateurs.map((annotateur, index) => (

                            <option key={index} value={annotateur.id}>
                                {annotateur.username} 
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-between max-xl:flex-col mb-6">
                    <Echart option={generatePieChartOptions(username, data4)} />
                    <Echart option={barChartOptions(label4, data4)} />
                </div> */}
                {/* <h2 className="text-3xl mb-5 text-center font-bold">Répartition des évaluations par validateur</h2>
                <div className="flex justify-between max-xl:flex-col mb-6">
                    <Echart option={generatePieChartOptions('', evaluatedByValidateur)} />
                    <Echart option={barChartOptions(labelByValidateur, evaluatedByValidateur)} />
                </div> */}

                {/* <h2 className="text-3xl text-center font-bold">Nombre d'Alignement source par année</h2>
                {isLoading && <span className="loading loading-bars loading-lg text-accent block m-auto"></span>}
                <div className="flex items-center gap-3">
                    Trier par year<input type="checkbox" className="toggle toggle-warning" defaultChecked  onChange={orderBy}/>Trier par nombre
                </div>
                <div className="flex justify-between mb-6">
                    <Echart option={barChartOptions(labelSourceYear, sourceYear)} />  
                </div>
                <h2 className="text-3xl text-center font-bold">Nombre d'Alignement cible par année</h2>
                <div className="flex justify-between mb-6">
                    <Echart option={barChartOptions(labelTargetYear, targetYear)} />  
                </div>

                <h2 className="text-3xl text-center font-bold">Nombre d'Alignement source par auteur</h2>
                {isLoading && <span className="loading loading-bars loading-lg text-accent block m-auto"></span>}
                <div className="flex items-center gap-3">
                    Trier par auteur<input type="checkbox" className="toggle toggle-warning" defaultChecked  onChange={orderByAuthor}/>Trier par nombre
                </div>
                <div className="flex justify-between mb-6">
                    <Echart option={barChartOptions(labelSourceAuthor, sourceAuthor)} />  
                </div>
                <h2 className="text-3xl text-center font-bold">Nombre d'Alignement cible par auteur</h2>
                <div className="flex justify-between mb-6">
                    <Echart option={barChartOptions(labelTargetAuthor, targetAuthor)} />  
                </div> */}
            </div>}
            <div className="p-5 flex">

                <div className="w-1/2">
                </div>
            </div>
        </div>
    );
}
