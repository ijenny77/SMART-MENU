import React from 'react'
import users from '../../../assets/Group 24.png'
import bag from '../../../assets/Group 25.png'
import bar from '../../../assets/Group 26.png'
import location from '../../../assets/Group 27.png'
import styles from './StatsSection.module.css'
const stats = [
    {
      id:1,
      icon:users,
      value:'100+',
      label:['Restaurants','Trust us']
    },
    {
      id:12,
      icon:bag,
      value:'100+',
      label:['Restaurants','Trust us']
    },
    {
      id:3,
      icon:bar,
      value:'100+',
      label:['Restaurants','Trust us']
    },
    {
      id:4,
      icon:location,
      value:'100+',
      label:['Restaurants','Trust us']
    },

]

const StatsSection = () => {
  return (
    <div className={styles.allStats}>
      {
        stats.map((stat, index)=>(
          <React.Fragment key={stat.id} >
            <div className={styles.statItem}>
              <img className={styles.statIcon} src={stat.icon}/>
              <div className={styles.statText}>
                <p>{stat.value}</p>
                <p>{stat.label[0]} <br/> {stat.label[1]}</p>
              </div>
            </div>
            {index < stats.length - 1 && (
            <div key={`divider-${index}`} className={styles.divider} />
          )}
          </React.Fragment>
        ))
      }
    </div>
  )
}

export default StatsSection