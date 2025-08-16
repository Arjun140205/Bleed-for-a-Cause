import React, { Component } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check for specific error types
      if (this.state.error?.message?.includes('Location')) {
        return (
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center mb-2">
              <FaExclamationTriangle className="text-yellow-500 mr-2" />
              <h3 className="font-semibold text-yellow-700">Location Access Required</h3>
            </div>
            <p className="text-yellow-600 mb-3">
              Please enable location access in your browser settings to use this feature.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
            >
              Try Again
            </button>
          </div>
        );
      }

      // Network error fallback
      if (this.state.error?.name === 'NetworkError') {
        return (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center mb-2">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <h3 className="font-semibold text-red-700">Connection Error</h3>
            </div>
            <p className="text-red-600 mb-3">
              Unable to connect to the server. Please check your internet connection.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        );
      }

      // Generic error fallback
      return (
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center mb-2">
            <FaExclamationTriangle className="text-gray-500 mr-2" />
            <h3 className="font-semibold text-gray-700">Something went wrong</h3>
          </div>
          <p className="text-gray-600 mb-3">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
