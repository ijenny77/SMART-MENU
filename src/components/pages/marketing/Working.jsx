import React from 'react'
import plusUsers from '../../../assets/User plus.png'
import vector from '../../../assets/Vector.png'
import hourglass from '../../../assets/hourglass.png'
import styles from './Working.module.css'
const cards =[
  {
    id:1,
    step:'STEP 1',
    icon:plusUsers,
    title:'Register your restaurant'
  },
  {
    id:2,
    step:"STEP 2",
    icon:vector,
    title:'Create your restaurant profile and create menus items'
  },
  {
    id:3,
    step:'STEP 3',
    icon:hourglass,
    title:'Start receiving the orders'
  }
]

const working = () => {
  return (
    <div className={styles.cards}>
      {cards.map((card,index)=>(
        <div className={styles.card}>
          <p className={styles.step}>{card.step}</p>
          <img className={styles.icon} src={card.icon} alt="" />
          <p className={styles.title}>{card.title}</p>
        </div>
      ))}
    </div>
  )
}

export default working