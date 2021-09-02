import { useEffect, useState } from 'react';
import '../App.css';

const Categorizer = (props) => {

  const [set, setSet] = useState(() => new Set());
  const [payload, buildPayload] = useState(
    props.links.map((ln) => {
      let temp = {};
      temp.link = ln + '';
      temp.keywords = 'N/A';
      temp.downloads = 0;
      return temp;
    })
  );
  const [idx, setIdx] = useState(0);
  const [keyword, setKeywords] = useState('');
  const [modalView, setModalView] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(false);

  useEffect(() => {
    console.log(set);
    if (set.size === props.links.length)
      setSubmitBtn(true);
  }, [set])

  const putNext = () => {
    if (idx < props.links.length - 1) 
      setIdx(idx + 1);
  }
  
  const putPrev = () => {
    if (idx > 0) 
      setIdx(idx - 1);
  }

  const resetInput = () => {
    document.getElementById("keywords").value = '';
  }

  const saveKeywords = () => {
    setSet(prev => new Set(prev).add(idx));
    payload[idx].keywords = keyword;
    setKeywords('');
    resetInput();
  }

  const setKeywordsListener = (e) => {
    setKeywords(e.target.value);
  }

  const toggleModal = () => {
    setModalView(!modalView);
  }

  return (
    <div className="CategorizerMain">
      {modalView && <pre className="category-modal">
        <div onClick={toggleModal} className="close-btn">CLOSE</div>
        {JSON.stringify(payload, null, 4)}
      </pre>}
      <pre className="payload-peek">{JSON.stringify(payload[idx], null, 4)}</pre>
      <div className="Categorizer">
        <div className="categorizer-form-div">
          <span>Keywords - {payload[idx].keywords}</span>
          <input id="keywords" type="text" onChange={setKeywordsListener} placeholder="keywords" name="keywords"/>
          <div className="controller-buttons">
            <button className="button button-info" onClick={putPrev} type="button">Prev</button>
            <button className="button button-info" onClick={putNext} type="button">Next</button>
            <button className="button button-save" onClick={saveKeywords} type="button">Save</button>
          </div>
          <div className="controller-buttons">
            <button className="button button-info" onClick={toggleModal} type="button">Modal</button>
            {submitBtn && <button className="button button-submit" onClick={toggleModal} type="button">Submit</button>}
          </div>
        </div>
        <div style={{backgroundImage: `url(${props.links[idx]})`}} className="categorizer-image-window"></div>
      </div>
    </div>
  );
}

export default Categorizer;
