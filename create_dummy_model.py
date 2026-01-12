import joblib
import numpy as np
from sklearn.dummy import DummyRegressor

# Create a dummy regressor
# It will predict the mean of the training data
dummy_regr = DummyRegressor(strategy="mean")

# Create some dummy data to fit the model
X_train = np.array([[1], [2], [3], [4]])
y_train = np.array([2, 3, 5, 4])

# Fit the model
dummy_regr.fit(X_train, y_train)

# Save the model
joblib.dump(dummy_regr, "backend/app/models/race_rank_model_v0.pkl")

print("Dummy model created and saved.")
