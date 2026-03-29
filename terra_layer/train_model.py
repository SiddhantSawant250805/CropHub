import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2 # type: ignore
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D # type: ignore
from tensorflow.keras.models import Model # type: ignore

def build_and_save_mock_model(save_path="model.h5"):
    """
    Builds a properly structured MobileNetV2 model for Soil Classification,
    compiles it, and saves it. 
    
    NOTE: This model starts with pre-trained ImageNet weights but the top classification 
    layer (for the 6 soil types) is untrained. It provides a functional placeholder 
    so the Terra Layer API runs perfectly while you prepare your real dataset.
    """
    print("Building MobileNetV2 base model...")
    # Load MobileNetV2 without the top ImageNet classification layer
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze the base model
    base_model.trainable = False

    # Add custom layers for our 6 Soil Classes: ['Clay', 'Sand', 'Silt', 'Loam', 'Peat', 'Chalk']
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    predictions = Dense(6, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer='adam', 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])

    print(f"Saving compiled model outline to {save_path}...")
    model.save(save_path)
    print("Success! The TerraAnalyzer API can now load model.h5 without crashing.")
    
    print("\n--- HOW TO TRAIN ON REAL DATA ---")
    print("When you have your real Kaggle Soil Dataset downloaded into a 'dataset/' folder:")
    print("1. Use tf.keras.preprocessing.image_dataset_from_directory('dataset/')")
    print("2. Call model.fit(train_dataset, epochs=10)")
    print("3. Call model.save('model.h5') again to overwrite this mock file.")

if __name__ == "__main__":
    import ssl
    # Bypass local SSL certificate verification for downloading the ImageNet weights
    ssl._create_default_https_context = ssl._create_unverified_context
    build_and_save_mock_model()
