import { Component } from 'react'

// Keeps one misbehaving widget (physics, game, chat) from taking the whole page down.
export default class ErrorBoundary extends Component {
  state = { err: null }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err) { console.error('[boundary]', err) }
  render() {
    if (this.state.err) return this.props.fallback ?? <div className="pixel" style={{ padding: '2rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--ink-2)' }}>this bit crashed 🙈 — refresh to try again</div>
    return this.props.children
  }
}
