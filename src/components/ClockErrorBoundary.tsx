import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  failed: boolean;
}

export default class ClockErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Clock] render error:', error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <div role="alert">
          This clock failed to load. <a href="/">Back to home</a>
        </div>
      );
    }
    return this.props.children;
  }
}