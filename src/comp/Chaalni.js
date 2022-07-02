import '../App.css';
import { useEffect, useState } from "react";
import axios from 'axios';

const Chaalni = (props) => {

    const REGEXEP = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g

    const [colName, setColName] = useState('');
    const [collections, setCollections] = useState([]);
    const [meta, setMeta] = useState([]);
    const [key, setKey] = useState('');

    const getCollections = () => {
        axios.get("http://nagdibai.xyz/wally-api/getCollections")
            .then((res) => {
                console.log(res.data)
                setCollections(res.data)
            })
            .catch((err) => {console.log(err)})
    }

    const getMeta = () => {
        axios.get("http://nagdibai.xyz/wally-api/grabMeta/all")
            .then((res) => {
                console.log(res.data)
                setMeta(res.data)
            })
            .catch((err) => {console.log(err)})
    }

    const filterLinks = (e) => {
        e.preventDefault();
        console.log('You clicked submit.');
        if (e.target[0].value !== '' && colName !== '') {
            const links = [...e.target[0].value.matchAll(REGEXEP)].map((tag) => tag[1]);
            props.grabImages(links, colName);
        } else {
            window.alert('Enter both the details');
        }
    }

    const toggleTrojan = (e) => {
        if (key === '') alert('Empty key')
        else {
            let config = {
                headers: {
                    "API-Key": key,
                }
            }
            axios.post(`http://nagdibai.xyz/wally-api/${meta[e.target.value].col}/trojanToggle`, {}, config)
                .then((res) => {
                    let newMeta = [...meta];
                    newMeta[e.target.value] = res.data.newRes;
                    setMeta(newMeta);
                    if(res.data.newRes.trojanMode){
                        e.target.innerText = "Trojan ON"
                        e.target.classList.remove("off");
                        e.target.classList.add("on");
                    } else {
                        e.target.innerText = "Trojan OFF"
                        e.target.classList.remove("on");
                        e.target.classList.add("off");
                    }
                })
                .catch((err) => {
                    if(err.response.status === 401){
                        alert("Bad Key")
                    }
                    console.dir(err)
                })
        }
    }

    const toggleAds = (e) => {
        if (key === '') alert('Empty key')
        else {
            let config = {
                headers: {
                    "API-Key": key,
                }
            }
            axios.post(`http://nagdibai.xyz/wally-api/${meta[e.target.value].col}/sdaToggle`, {}, config)
                .then((res) => {
                    let newMeta = [...meta];
                    newMeta[e.target.value] = res.data.newRes;
                    setMeta(newMeta);
                    if(res.data.newRes.sda){
                        e.target.innerText = "Ads ON"
                        e.target.classList.remove("on");
                        e.target.classList.add("off");
                    } else {
                        e.target.innerText = "Ads OFF"
                        e.target.classList.remove("off");
                        e.target.classList.add("on");
                    }
                })
                .catch((err) => {
                    if(err.response.status === 401){
                        alert("Bad Key")
                    }
                    console.dir(err)
                })
        }
    }

    const saveKey = (e) => {
        setKey(e.target.value)
    }

    const colChange = (e) => {
        setColName(e.target.value);
        console.log(e.target.value);
    }

    useEffect(() => {
        getCollections()
        getMeta()
    }, [])

    return (
        <main>
            <div className="left-panel">
                <input type="text" placeholder='key' onChange={saveKey}/>
                {meta.map((mm, idx) => (
                    <div key={idx}>
                        <p>{mm.col}</p>
                        <button value={idx} onClick={toggleTrojan} className={"liveconfig " +(mm.trojanMode ? "on" : "off")} >Trojan {mm.trojanMode ? "ON" : "OFF"}</button>
                        <button value={idx} onClick={toggleAds} className={"liveconfig " +(mm.sda ? "off" : "on")} >Ads {mm.sda ? "ON" : "OFF"}</button>
                    </div>
                ))}
            </div>
            <div className="right-panel">
                <div className="Chaalni">
                    <form id="filterForm" onSubmit={filterLinks}>
                        <textarea id="bloggermarkup" className="blogger-blob" cols="86" rows ="20" name="bloggermarkup" form="filterForm"></textarea>
                        <div className="controller-buttons">
                        <select className="collections" name="dropdown" onChange={colChange}>
                            <option key="default" value="DEFAULT">Choose a collection ...</option>
                            {collections.map(cc => (
                                <option key= {cc} value={cc}>{cc}</option>
                            ))}
                        </select>
                        <input type="submit" value="Filter" className="button chaalni-btn"/>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Chaalni;
