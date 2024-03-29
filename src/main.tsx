import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import './assets/styles/global.less'
import { renderRoutes } from 'react-router-config'
import { PersistGate } from 'redux-persist/integration/react'
import AppRoute from './router'
import { Provider } from 'react-redux'
import { store, persistor } from '@/store'
import { ConfigProvider } from 'antd'
// import './index.css'
import 'moment/dist/locale/zh-cn'
function Main() {
	return (
		<Provider store={store}>
			<ConfigProvider>
				<PersistGate loading={null} persistor={persistor}>
					<AppRoute />
				</PersistGate>
			</ConfigProvider>
		</Provider>
	)
}

ReactDOM.render(<Main />, document.getElementById('root'))
