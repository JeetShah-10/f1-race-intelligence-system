import subprocess
import sys
import os
import time

# List of scripts to run in order
# (script_filename, description)
CHECKS = [
    ("verify_db_connection.py", "Database Connectivity"),
    ("verify_metadata_rows.py", "Historical Data (2025)"),
    ("verify_day2_ml.py", "ML Pipeline (Training/Prediction)"),
    ("verify_simulation.py", "Simulation Engine (Physics/Strategy)"),
    ("verify_websocket.py", "Real-Time WebSocket API")
]

def run_audit():
    print("Starting Backend System Audit...")
    print("===================================\n")
    
    context_dir = os.path.dirname(os.path.abspath(__file__))
    results = []

    for script, desc in CHECKS:
        print(f"Checking: {desc} ({script})", end=" ... ", flush=True)
        start_time = time.time()
        
        script_path = os.path.join(context_dir, script)
        
        # Subprocess to isolate environments
        try:
            # Capture output to avoid clutter unless failed
            result = subprocess.run(
                [sys.executable, script_path],
                cwd=context_dir, # Run from scripts dir? Or root? usually root logic inside script handles paths
                capture_output=True,
                text=True,
                encoding='utf-8' # Force utf-8
            )
            duration = time.time() - start_time
            
            if result.returncode == 0:
                print(f"PASS ({duration:.2f}s)")
                results.append((desc, True, result.stdout))
            else:
                print(f"FAIL ({duration:.2f}s)")
                results.append((desc, False, result.stderr + "\n" + result.stdout))
                
        except Exception as e:
            print(f"ERROR: {e}")
            results.append((desc, False, str(e)))

    print("\n===================================")
    print("Audit Summary")
    print("===================================")
    
    passed = sum(1 for _, success, _ in results if success)
    total = len(results)
    
    print(f"Score: {passed}/{total} Systems Operational\n")
    
    for desc, success, output in results:
        status = "[OK]" if success else "[FAIL]"
        print(f"{status} {desc}")
        if not success:
            print("   Error Log:")
            # Indent log
            for line in output.splitlines()[-10:]: # Show last 10 lines
                print(f"      {line}")
    
    if passed == total:
        print("\nSYSTEM HEALTHY. READY FOR FRONTEND.")
        sys.exit(0)
    else:
        print("\nSYSTEM ISSUES DETECTED.")
        sys.exit(1)

if __name__ == "__main__":
    run_audit()
