'use client'

import React from 'react'

type ErrorBoundaryState = { hasError: boolean }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught error', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40 }}>
          <h2>Something went wrong.</h2>
          <p>Please try again later.</p>
        </div>
      )
    }
    return this.props.children
  }
}


