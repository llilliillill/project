import './Finance.css'
import arr from './Array.json'
import { useState } from 'react'


export default function Finance(){

  const index = (counter => () => ++counter)(0)
  const [array,   getItem] = useState(arr)
  const [state1,  addItem] = useState(false)
  const [state2, editItem] = useState(null)
  const [state3,   focuse] = useState(true)

  /* [ СОРТИРОВКА ДАТЫ ПО ВОЗРАСТАНИЮ ] */
  array.sort((a,b) => {
    return dateToNumber(a['date']) - dateToNumber(b['date'])
  })

  /* [ ПОЛУЧИТЬ СЕГОДНЯШНЮЮ ДАТУ ] */ 
  function date(){
    return (new Date()).toLocaleString('ru', {
      year:  'numeric', 
      month: 'numeric', 
      day:   'numeric'
    })
  }

  /* [ УДАЛЕНИЕ ЯЧЕЙКИ ] */ 
  function itemDel(id){
    editItem(null)
    getItem(array.filter((item, i) => (i !== id ? true : false)))
  }

  /* [ ДОБАВЛЕНИЕ ЯЧЕЙКИ ] */ 
  function itemAdd(action){
    if(action === 'close'){
      addItem(false)
    } else {
      editItem(null)
      addItem(true)
    }
  }

  /* [ РЕДАКТИРОВАНИЕ ЯЧЕЙКИ ] */ 
  function itemEdit(index, focus){
    addItem(false)
    focuse(focus)
    editItem(index)
  }

  /* [ ЗАПИСАТЬ ДАННЫЕ ПРИ НАЖАТИИ НА ENTER ] */ 
  function pressEnter(e,i,action){
    if(e.key === 'Enter'){

      if(action === 'add'){
        addItem(false);
        getItem(array.concat({
          date: formatDate(getInputValue('addDate')),
          number: formatNumber(getInputValue('addNumber'))
        }));
      }

      if(action === 'edit'){
        editItem(null)
        if(state3){
          array[i]['date'] = formatDate(getInputValue('item'))
        } else {
          array[i]['number'] = formatNumber(getInputValue('item'))
        } 
        getItem(array)
      }

    } 
  }

  /* [ ФОРМАТИРОВАНИЕ DATE ] */ 
  function formatDate(value){
    return (value ? value : date())
  }

  /* [ ФОРМАТИРОВАНИЕ NUMBER ] */ 
  function formatNumber(value){
    return (value > 0 && value.substring(0,1) !== '+' 
    ? '+'+value : (value === '' ? '0' : value))
  }

  /* [ ПОЛУЧИТЬ ЦВЕТ ТЕКСТА ] */ 
  function getTextColor(value){
    value = String(value)
    return (value.substring(0,1) === '+' ? {color: 'green'} : 
    (value.substring(0,1) === '-' ? {color: 'red'} : {color: 'gray'})) 
  }

  /* [ ПОЛУЧИТЬ ЗНАЧЕНИЕ INPUT ПО ID ] */
  function getInputValue(elemId){
    return document.getElementById(elemId).value
  }

  /* [ СУМИРОВАТЬ ВСЕ ЯЧЕЙКИ И ВЫВЕСТИ РЕЗУЛЬТАТ ] */ 
  function result(){
    let n = 0;
    for(let i=0; i<array.length; i++){
      n += (!array[i]['number'].match(/[a-zа-я]+/i) ? parseFloat(array[i]['number']) : 0)
    } 
    return (n > 0 ? '+'+n.toFixed(2) : n.toFixed(2)).replace('.00', '')
  }

  /* [ ДАТА В ЧИСЛО ] */
  function dateToNumber(str){
    return parseInt(str.slice(6,11)+str.slice(3,5)+str.slice(0,2))
  }

  /* [ СБРОС ] */
  function reset(){
    addItem(false)
    editItem(null)
  }


  
  return (
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Дата</th>
          <th>Доходы/Расходы</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
      {array.map((item, i) => {

        if( !(state2 !== null && state2 === i) ){

          /* [ ОБЫЧНАЯ ЯЧЕЙКА ] */ 
          return (
            <tr key={i}>
              <td>{index()}</td>
              <td onClick={() => itemEdit(i,true)}>{item['date']}</td>
              <td onClick={() => itemEdit(i,false)} style={getTextColor(item['number'])}>{item['number']}</td>
              <td onClick={() => itemDel(i)}>✕</td>
            </tr>
          )
        
        } else {

          /* [ РЕДАКТИРУЕМАЯ ЯЧЕЙКА ] */ 
          if(state3){

            /* [ РЕДАКТИРУЕМ ПОЛЕ DATE ] */ 
            return (
              <tr onKeyDown={(e) => pressEnter(e,i,'edit')} key={i}>
                <td>{index()}</td>
                <td><input id='item' defaultValue={array[i]['date']} placeholder={date()} onBlur={() => reset()} autoFocus/></td>
                <td onClick={() => itemEdit(i,false)} style={getTextColor(item['number'])}>{item['number']}</td>
                <td>✕</td>
              </tr>
            )
            
          } else {
            
            /* [ РЕДАКТИРУЕМ ПОЛЕ NUMBER ] */ 
            return (
              <tr onKeyDown={(e) => pressEnter(e,i,'edit')} key={i}>
                <td>{index()}</td>
                <td onClick={() => itemEdit(i,true)}>{item['date']}</td>
                <td><input id='item' defaultValue={array[i]['number']} placeholder={'0'} onBlur={() => reset()} autoFocus/></td>
                <td>✕</td>
              </tr>
            )
            
          }

        }

      })}
      </tbody>

      <tfoot>
        { /* [ ИТОГО: ] */ 
          (array.length > 0 ?
          <tr><th colSpan={2}>Итого:</th><td style={getTextColor(result())} id='result'>{result()}</td><td></td></tr> :
          <tr><th colSpan={4} style={{color: 'red'}}>Список пуст!</th></tr>)
        }

        { /* [ ДОБАВЛЕНИЕ ЯЧЕЙКИ ] */ 
        (!state1 ? <tr className='addButton'><th colSpan={4} onClick={() => itemAdd()}>Add</th></tr> :
          <tr className='addEditor' onKeyDown={(e) => pressEnter(e,0,'add')}>
            <td>{array.length + 1}</td>
            <td><input id='addDate'   defaultValue={date()} placeholder={date()} /></td>
            <td><input id='addNumber' placeholder={'0'} autoFocus/></td>
            <td onClick={() => itemAdd('close')}>✕</td>
          </tr>)
        }
      </tfoot>
    </table>
  );

}
