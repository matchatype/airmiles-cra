import React from 'react'
import List from './components/offer/list'

function App() {
  return (
    <section className="container">
      <header>
        <img
          src="/air-miles-logo.svg"
          alt="Air Miles company logo"
          className="logo"
        />
        <h1>Air Miles</h1>
      </header>
      <main>
        <h2>Technical Interview</h2>
        <List />
      </main>
    </section>
  )
}

export default App
