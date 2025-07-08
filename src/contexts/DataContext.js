import React from 'react'

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {

    const [liveData, setLiveData] = React.useState(null);
    const [historyData, setHistoryData] = React.useState(null);
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [previousData, setPreviousData] = React.useState(null);

    const fetchData = () => {

        fetch('https://swh-backend.onrender.com/api/live')
            .then(res => res.json())
            .then(json => {

                setLiveData(json.data);
                setPreviousData(json.previous);

            })
            .catch(err => console.error('Fetch error:', err));

        fetch('https://swh-backend.onrender.com/api/history')
            .then(res => res.json())
            .then(json => {

                setHistoryData(json);
            })
            .catch(err => console.error('Fetch error:', err));

        // https://swh-backend.onrender.com

    };


    return (
        <DataContext.Provider value={{
            fetchData,
            data: {
                live: liveData,
                history: historyData,
                previous: previousData,
            },
            setDataLoaded,
            dataLoaded,
        }}>
            {children}
        </DataContext.Provider>
    )

}