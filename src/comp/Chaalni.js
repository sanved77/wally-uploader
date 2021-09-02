import '../App.css';

const Chaalni = (props) => {

    const REGEXEP = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g

    const filterLinks = (e) => {
        e.preventDefault();
        console.log('You clicked submit.');
        const links = [...e.target[0].value.matchAll(REGEXEP)].map((tag) => tag[1]);
        props.grabImages(links);
    }
    return (
        <div className="Chaalni">
            <form id="filterForm" onSubmit={filterLinks}>
                <textarea id="bloggermarkup" className="blogger-blob" cols="86" rows ="20" name="bloggermarkup" form="filterForm"></textarea>
                <div className="controller-buttons">
                    <input type="submit" value="Filter" className="button"/>
                </div>
            </form>
        </div>
    );
}

export default Chaalni;
