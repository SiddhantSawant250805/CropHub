import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

def train_real_model(dataset_path="dataset/CyAUG-Dataset", save_path="model.h5"):
    print("Loading Images from Directory...")
    
    # 1. Automatically load all images from folders and resize them to 224x224
    train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(224, 224),
        batch_size=32
    )
    
    validation_dataset = tf.keras.preprocessing.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(224, 224),
        batch_size=32
    )

    # Automatically grab the folder names to use as our classes!
    class_names = train_dataset.class_names
    print(f"Detected Soil Classes: {class_names}")

    print("Building MobileNetV2 base model...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False # Freeze core weights initially

    # Custom Classification Head mapping to the # of Classes we found
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    predictions = Dense(len(class_names), activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer='adam', 
                  loss='sparse_categorical_crossentropy', 
                  metrics=['accuracy'])

    print("Beginning Training! This may take a few minutes...")
    # 2. Train the model on your images!
    model.fit(train_dataset, validation_data=validation_dataset, epochs=10)

    print(f"Saving newly trained model to {save_path}...")
    model.save(save_path)
    print("Training Complete! The TerraAnalyzer will now make real predictions.")

if __name__ == "__main__":
    import ssl
    ssl._create_default_https_context = ssl._create_unverified_context
    
    if os.path.exists("dataset"):
        train_real_model()
    else:
        print("ERROR: Could not find a 'dataset' folder. Please download the Kaggle dataset and put it in the terra_layer directory!")
