import React from 'react'

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';
import '@shoelace-style/shoelace/dist/themes/light.css';

import styles from './App.module.css';

// Config shoelace assets path
setBasePath('/shoelace')

function App() {
    return (
        <div className={styles.container}>
            MS-DOS
        </div>
    );
}

export default App;
