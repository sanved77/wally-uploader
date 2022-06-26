import '../App.css';
import { useEffect, useState } from "react";
import axios from 'axios';

const Chaalni = (props) => {

    const REGEXEP = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g

    const [colName, setColName] = useState('');
    const [collections, setCollections] = useState([]);

    const getCollections = () => {
        axios.get("http://nagdibai.xyz/wally-api/getCollections")
            .then((res) => {
                console.log(res.data)
                setCollections(res.data)
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

    const colChange = (e) => {
        setColName(e.target.value);
        console.log(e.target.value);
    }

    useEffect(() => {
        getCollections()
    }, [])

    return (
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
    );
}

export default Chaalni;
