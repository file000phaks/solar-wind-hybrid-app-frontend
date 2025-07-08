import React from 'react'

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {

    const [liveData, setLiveData] = React.useState(null);
    const [historyData, setHistoryData] = React.useState(null);
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [previousData, setPreviousData] = React.useState(null);

    const [temp, setTemp] = React.useState(null);

    const fetchData = () => {

        fetch('http://192.168.115.136:5000/weather')
            .then(res => res.json())
            .then(json => {

                console.log(json);

                setTemp(json);

                    // setLiveData(json.data);
                    // setPreviousData(json.previous);

            })
            .catch(err => console.error('Fetch error:', err));

        fetch('http://localhost:5000/api/history')
            .then(res => {res.json()})
            .then(json => {
                if (Array.isArray(json) && json.length > 0) setHistoryData(json[0]);
            })
            .catch(err => console.error('Fetch error:', err));

        // fetch('http://192.168.115.136:5000/weather)

    };

    React.useEffect(() => {

        console.log(temp);
;
    }, [temp])

    return (
        <DataContext.Provider value={{
            fetchData,
            data: {
                live: liveData,
                history: historyData,
                previous: previousData,
                temp,
            },
            setDataLoaded,
            dataLoaded,
        }}>
            {children}
        </DataContext.Provider>
    )

}