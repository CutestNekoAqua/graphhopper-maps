import React, { useState } from 'react'
import styles from './MapOptions.modules.css'
import { MapboxStyle, MapOptionsStoreState } from '@/stores/MapOptionsStore'
import Dispatcher from '@/stores/Dispatcher'
import { SelectMapStyle, ToggleRoutingGraph } from '@/actions/Actions'
import PlainButton from '@/PlainButton'
import LayerImg from './layer-group-solid.svg'
import config from 'config'

export default function (props: MapOptionsStoreState) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div
            className={styles.mapOptionsContainer}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {isOpen ? (
                <Options storeState={props} notifyChanged={() => setIsOpen(false)} />
            ) : (
                <PlainButton className={styles.layerButton} onClick={() => setIsOpen(true)}>
                    <LayerImg />
                </PlainButton>
            )}
        </div>
    )
}

interface OptionsProps {
    storeState: MapOptionsStoreState
    notifyChanged: { (): void }
}

const Options = function ({ storeState, notifyChanged }: OptionsProps) {
    return (
        <>
            <div className={styles.options}>
                <div
                    onChange={e => {
                        notifyChanged()
                        onStyleChange(e.target as HTMLInputElement, storeState.mapStyles)
                    }}
                >
                    {storeState.mapStyles.map(style => (
                        <div className={styles.option} key={style.name}>
                            <input
                                type="radio"
                                id={style.name}
                                name="layer"
                                value={style.name}
                                defaultChecked={style === storeState.selectedMapStyle}
                                disabled={!storeState.isMapLoaded}
                            />
                            <label htmlFor={style.name}>{style.name}</label>
                        </div>
                    ))}
                </div>
                {config.graphLayerAllowed && (
                    <div className={styles.option}>
                        <input
                            type="checkbox"
                            name="routing-graph"
                            defaultChecked={storeState.routingGraphEnabled}
                            disabled={false}
                            onChange={e => {
                                notifyChanged()
                                Dispatcher.dispatch(new ToggleRoutingGraph(e.target.checked))
                            }}
                        />
                        <label htmlFor="routing graph">Routing Graph</label>
                    </div>
                )}
            </div>
        </>
    )
}

function onStyleChange(target: HTMLInputElement, options: MapboxStyle[]) {
    const option = options.find(option => option.name === target.value)

    if (option) Dispatcher.dispatch(new SelectMapStyle(option))
}
