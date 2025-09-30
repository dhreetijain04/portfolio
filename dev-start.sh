#!/bin/bash

echo "🚀 Starting Portfolio Development Environment..."
echo "📂 Navigating to project directory..."

# Navigate to project root
cd "$(dirname "$0")" || exit 1

# Function to check if port is in use
check_port() {
    local port=$1
    if netstat -an | grep -q ":$port.*LISTENING"; then
        echo "⚠️  Port $port is already in use"
        return 0
    else
        return 1
    fi
}

# Function to start backend
start_backend() {
    echo "🔧 Starting backend server..."
    cd server || exit 1
    
    if check_port 5000; then
        echo "✅ Backend already running on port 5000"
    else
        echo "🔄 Starting backend server..."
        DB_PASSWORD=Admin npm run dev &
        BACKEND_PID=$!
        echo "Backend PID: $BACKEND_PID"
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting frontend server..."
    cd client || exit 1
    
    if check_port 5173; then
        echo "✅ Frontend already running"
    else
        echo "🔄 Starting frontend server..."
        npm run dev &
        FRONTEND_PID=$!
        echo "Frontend PID: $FRONTEND_PID"
    fi
    
    cd ..
}

# Function to open browser
open_browser() {
    echo "🌐 Waiting for servers to start..."
    sleep 5
    
    # Try different ports where frontend might be running
    for port in 5173 5174 5175; do
        if netstat -an | grep -q ":$port.*LISTENING"; then
            echo "🔗 Opening browser at http://localhost:$port"
            if command -v start &> /dev/null; then
                start http://localhost:$port
            elif command -v xdg-open &> /dev/null; then
                xdg-open http://localhost:$port
            elif command -v open &> /dev/null; then
                open http://localhost:$port
            else
                echo "📋 Please open http://localhost:$port in your browser"
            fi
            break
        fi
    done
}

# Cleanup function
cleanup() {
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up cleanup on script exit
trap cleanup SIGINT SIGTERM

# Main execution
echo "🎯 Starting development servers..."
start_backend
start_frontend
open_browser

echo "✅ Portfolio development environment is ready!"
echo "🔧 Backend: http://localhost:5000"
echo "🎨 Frontend: Check ports 5173, 5174, or 5175"
echo "📝 Press Ctrl+C to stop all servers"

# Keep script running
wait