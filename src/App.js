import './App.css';
import React, { useEffect, useState, useCallback } from 'react';
import { PACKAGES, DELIVERY_PEOPLE } from './data';

function App() {

  const [packages, setPackages] = useState([])
  const [items, setItems] = useState([])

  const delivered = useCallback((pack) => {
    const updatedItems = items.map(item => {
      const thePacks = item.packs.map(pk => {
        if (pk.name === pack.name) {
          pk.delivered = true
        }
        return pk
      })
      return {
        person: item.person,
        packs: thePacks
      }
    })
    setItems(updatedItems)
  }, [items])

  useEffect(() => {
    let _packages = [...PACKAGES].map(item => {
      item.delivered = false
      return item
    })
    const delivery = [...DELIVERY_PEOPLE].map(person => {
      const packsByZone = _packages.filter(_package => _package.zone === person.zone)
      const packs = packsByZone.slice(0, person.max_packages)
      const names = packs.map(item => item.name)
      _packages = _packages.filter(item => !names.includes(item.name))

      return {
        person,
        packs,
      }
    })

    setItems(delivery)

    const assigned = delivery.reduce((acc, i) => {
      const res = i.packs.map(j => j.name)
      return [...acc, ...res]
    }, [])

    const pending = _packages.filter(p => !assigned.includes(p.name))
    setPackages(pending)
  }, [])

  return (
    <div>
      <h1>Delivery Process</h1>
      <h4>Instructions:</h4>
      <ul>
        <li>Display a button that when clicking it should assigns packages for each delivery people for the zone they are assigned to that not exceeds the max limit they can deliver per day.</li>
        <li>When completing a delivery, row must be hightligthed in green color.</li>
        <li>If a delivery is delayed, it will be added to the next day queue and it will have priority over the Tomorrow's deliveries to the zone it belongs to.</li>
        <li>In case there are no packages for the zone a delivery man is assigned to, then they will be assigned the deliveries of the zone with the max number of packages that not exceeds the max limit they can deliver per day.</li>
      </ul>
      <h2>Today</h2>
      <table width="100%" className='main-table'>
        <thead>
          <tr>
          <th>Delivery Man</th>
          <th>Max</th>
            <th>Packages</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            return (
              <tr key={item.person.name}>
                <td>{item.person.name}</td>
                <td align='center'>{item.person.max_packages}</td>
                <td>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th width="50%">Name</th>
                        <th width="10%">Zone</th>
                        <th width="10%">Status</th>
                        <th width="30%"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        item.packs.map((pack, p) => {
                          return (
                            <tr key={`${pack.name}-${p}`} className={pack.delivered ? "green" : "yellow"}>
                              <td>{pack.name}</td>
                              <td align='center'>{pack.zone}</td>
                              <td align='center'>{pack.delivered ? "DELIVERED" : "ON THE WAY"}</td>
                              <td align='center'>
                              {!pack.delivered && <button onClick={() => delivered(pack)}>COMPLETE</button>}
                              {!pack.delivered && (
                                <>
                                &nbsp;|&nbsp;<button>DELAY 1 DAY</button>
                                </>
                              )}
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <h2>Tomorrow</h2>
      <table width="60%" className='main-table'>
        <thead>
          <tr>
            <th width="70%">Name</th>
            <th width="10%">Zone</th>
          </tr>
        </thead>
        <tbody>
          {
            packages.map((pack, p) => {
              return (
                <tr key={`${pack.name}-${p}`} className={pack.delivered ? "green" : "yellow"}>
                  <td>{pack.name}</td>
                  <td align='center'>{pack.zone}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
