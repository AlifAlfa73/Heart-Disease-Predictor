import pickle
from sklearn.preprocessing import MinMaxScaler


def read_pickle():
    with open("data/mlp.pkl", "rb") as f:
        model = pickle.load(f)
    with open("data/x_test.pkl", "rb") as f:
        x_test = pickle.load(f)
    return model, x_test


def pre_process(user_input, x_test):
    removed_input = remove_columns(user_input)
    x_test.append(removed_input)
    scaler_test = MinMaxScaler(feature_range=(0, 1))
    scaled_total = scaler_test.fit_transform(x_test)
    scaled_input = scaled_total[-1]
    return scaled_input


def remove_columns(user_input):
    """
    Function to pre-process user_input -> remove unnecessary column
    :param user_input:
    :return: array
    """
    arr = [
        user_input['age'], user_input['sex'], user_input['chest_pain_type'],
        user_input['serum_cholesterol'], user_input['max_heart_rate_achieved'], user_input['exercise_induced_angina'],
        user_input['peak_exercise_st_segment'], user_input['num_major_flourosopy'], user_input['thal']
    ]
    for idx, value in enumerate(arr):
        arr[idx] = float(value)
    return arr

def predict_data(user_input):
    # Read data
    model, x_test = read_pickle()
    processed_input = pre_process(user_input, x_test)
    prediction = model.predict([processed_input])
    percentage = model.predict_proba([processed_input])
    return {
        "prediction": prediction.tolist()[0], 
        "percentage": percentage.tolist()[0]
    }