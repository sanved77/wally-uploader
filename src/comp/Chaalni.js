import '../App.css';
import { useState } from "react";

const Chaalni = (props) => {

    const REGEXEP = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g

    const [colName, setColName] = useState('');

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

    const setColNameListener = (e) => {
        setColName(e.target.value);
    };

    return (
        <div className="Chaalni">
            <form id="filterForm" onSubmit={filterLinks}>
                <textarea id="bloggermarkup" className="blogger-blob" cols="86" rows ="20" name="bloggermarkup" form="filterForm"></textarea>
                <div className="controller-buttons">
                    <input
                        id="collection-name"
                        type="text"
                        onChange={setColNameListener}
                        placeholder="put collection name"
                        name="collection-name"
                    />
                    <input type="submit" value="Filter" className="button"/>
                </div>
            </form>
        </div>
    );
}

export default Chaalni;
