(function() {
    // Function to initialize a BMI calculator instance
    function initBMICalculator(targetElement) {
        // 1. Ensure Tailwind CSS is available (optional, but needed for original styling)
        //    It's best if the user includes this in their <head> for reliability.
        if (!document.querySelector('script[src*="cdn.tailwindcss.com"]') &&
            !document.querySelector('link[href*="cdn.tailwindcss.com"]')) {
            console.warn("BMI Calculator: Tailwind CSS CDN not found. Attempting to load. For best results, include it in your HTML <head>.");
            const tailwindScript = document.createElement('script');
            tailwindScript.src = "https://cdn.tailwindcss.com";
            document.head.appendChild(tailwindScript);
        }

        // 2. Inject Custom CSS for animations and initial states
        const customStylesId = 'bmi-calculator-custom-styles';
        if (!document.getElementById(customStylesId)) {
            const customStyles = `
                @keyframes bmiFadeInAnimation {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .bmi-animate-fade-in {
                    animation: bmiFadeInAnimation 0.5s ease-out forwards;
                }
                .bmi-result-container-hidden {
                    display: none !important; /* Use important to ensure it's hidden initially */
                }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.id = customStylesId;
            styleSheet.type = "text/css";
            styleSheet.innerText = customStyles;
            document.head.appendChild(styleSheet);
        }

        // 3. Define HTML Structure
        //    Using data-bmi-id for unique element selection within this calculator instance.
        const calculatorHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div class="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
                    <div class="p-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">BMI Calculator</h2>

                        <div class="mb-6 flex justify-around">
                            <button data-bmi-id="metricButton"
                                class="px-4 py-2 rounded-md bg-indigo-600 text-white">
                                Metric
                            </button>
                            <button data-bmi-id="imperialButton"
                                class="px-4 py-2 rounded-md bg-gray-200 text-gray-700">
                                Imperial
                            </button>
                        </div>

                        <form data-bmi-id="bmiForm" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <input data-bmi-id="age" type="number" placeholder="Age"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select data-bmi-id="gender"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label data-bmi-id="weightLabel" class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                    <input data-bmi-id="weight" type="number" placeholder="kg" required
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>

                                <div>
                                    <label data-bmi-id="heightLabel" class="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                    <input data-bmi-id="height" type="number" placeholder="cm" required
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>

                            <button type="submit"
                                class="w-full mt-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Calculate BMI
                            </button>
                        </form>

                        <div data-bmi-id="bmiResultContainer" class="mt-6 p-4 bg-indigo-50 rounded-lg bmi-result-container-hidden">
                            <h3 class="text-lg font-semibold text-indigo-800 text-center">Your BMI is</h3>
                            <p data-bmi-id="bmiValue" class="text-3xl font-bold text-indigo-900 text-center mt-2"></p>
                            <p data-bmi-id="bmiCategory" class="text-center text-gray-600 mt-1"></p>

                            <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div data-bmi-id="bmiProgressBar" class="h-full transition-all duration-500 ease-out">
                                </div>
                            </div>

                            <div class="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Underweight</span>
                                <span>Normal</span>
                                <span>Overweight</span>
                                <span>Obesity</span>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                        <p class="text-xs text-gray-500">
                            This calculator provides an estimate of body mass index (BMI). For health-related concerns, consult a healthcare professional.
                        </p>
                    </div>
                </div>
            </div>
        `;

        // 4. Inject HTML into the target container
        targetElement.innerHTML = calculatorHTML;

        // 5. Get references to DOM elements (scoped within the targetElement)
        const getEl = (id) => targetElement.querySelector(`[data-bmi-id="${id}"]`);

        const metricButton = getEl('metricButton');
        const imperialButton = getEl('imperialButton');
        const bmiForm = getEl('bmiForm');
        // const ageInput = getEl('age'); // Not used in BMI calc but available
        // const genderInput = getEl('gender'); // Not used in BMI calc but available
        const weightInput = getEl('weight');
        const heightInput = getEl('height');
        const weightLabel = getEl('weightLabel');
        const heightLabel = getEl('heightLabel');

        const bmiResultContainer = getEl('bmiResultContainer');
        const bmiValueDisplay = getEl('bmiValue');
        const bmiCategoryDisplay = getEl('bmiCategory');
        const bmiProgressBar = getEl('bmiProgressBar');

        // 6. State variables
        let unitSystem = 'metric';

        // 7. Helper functions
        function getCategoryColorClass(category) {
            switch (category) {
                case 'Underweight': return 'bg-blue-500';
                case 'Normal weight': return 'bg-green-500';
                case 'Overweight': return 'bg-yellow-500';
                case 'Obesity': return 'bg-red-500';
                default: return 'bg-gray-500';
            }
        }

        function getCategoryWidth(bmi) {
            if (bmi < 16) return '10%';
            if (bmi < 18.5) return '25%';
            if (bmi < 24.9) return '50%';
            if (bmi < 29.9) return '75%';
            return '100%';
        }

        function determineCategory(bmi) {
            if (bmi < 18.5) return 'Underweight';
            if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
            if (bmi >= 25 && bmi < 29.9) return 'Overweight';
            return 'Obesity';
        }

        // 8. UI Update Functions
        function updateUnitSystemUI() {
            if (unitSystem === 'metric') {
                metricButton.classList.remove('bg-gray-200', 'text-gray-700');
                metricButton.classList.add('bg-indigo-600', 'text-white');
                imperialButton.classList.remove('bg-indigo-600', 'text-white');
                imperialButton.classList.add('bg-gray-200', 'text-gray-700');

                weightLabel.textContent = 'Weight (kg)';
                weightInput.placeholder = 'kg';
                heightLabel.textContent = 'Height (cm)';
                heightInput.placeholder = 'cm';
            } else { // imperial
                imperialButton.classList.remove('bg-gray-200', 'text-gray-700');
                imperialButton.classList.add('bg-indigo-600', 'text-white');
                metricButton.classList.remove('bg-indigo-600', 'text-white');
                metricButton.classList.add('bg-gray-200', 'text-gray-700');

                weightLabel.textContent = 'Weight (lbs)';
                weightInput.placeholder = 'lbs';
                heightLabel.textContent = 'Height (inches)';
                heightInput.placeholder = 'inches';
            }
            bmiResultContainer.classList.add('bmi-result-container-hidden');
            bmiResultContainer.classList.remove('bmi-animate-fade-in');
        }

        // 9. Event Listeners
        metricButton.addEventListener('click', () => {
            if (unitSystem !== 'metric') {
                unitSystem = 'metric';
                updateUnitSystemUI();
            }
        });

        imperialButton.addEventListener('click', () => {
            if (unitSystem !== 'imperial') {
                unitSystem = 'imperial';
                updateUnitSystemUI();
            }
        });

        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value);

            if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                alert('Please enter valid weight and height.');
                bmiResultContainer.classList.add('bmi-result-container-hidden');
                bmiResultContainer.classList.remove('bmi-animate-fade-in');
                return;
            }

            let bmiValue = 0;
            if (unitSystem === 'metric') {
                const heightInMeters = height / 100;
                bmiValue = weight / (heightInMeters * heightInMeters);
            } else {
                bmiValue = (weight / (height * height)) * 703;
            }

            const calculatedBmi = bmiValue.toFixed(1);
            const currentCategory = determineCategory(bmiValue);

            bmiValueDisplay.textContent = calculatedBmi;
            bmiCategoryDisplay.textContent = `(${currentCategory})`;

            bmiProgressBar.className = 'h-full transition-all duration-500 ease-out'; // Reset classes
            const colorClass = getCategoryColorClass(currentCategory);
            if (colorClass) bmiProgressBar.classList.add(colorClass);
            bmiProgressBar.style.width = getCategoryWidth(parseFloat(calculatedBmi));

            bmiResultContainer.classList.remove('bmi-result-container-hidden');
            bmiResultContainer.classList.remove('bmi-animate-fade-in');
            void bmiResultContainer.offsetWidth; // Trigger reflow for animation restart
            bmiResultContainer.classList.add('bmi-animate-fade-in');
        });

        // 10. Initial UI setup
        updateUnitSystemUI();
    }

    // Automatically initialize all elements with class "bmi-calculator"
    document.addEventListener('DOMContentLoaded', () => {
        const calculatorPlaceholders = document.querySelectorAll('.bmi-calculator');
        if (calculatorPlaceholders.length === 0) {
            console.warn('BMI Calculator: No element with class "bmi-calculator" found to initialize.');
        }
        calculatorPlaceholders.forEach(placeholder => {
            // Check if already initialized
            if (!placeholder.dataset.bmiInitialized) {
                initBMICalculator(placeholder);
                placeholder.dataset.bmiInitialized = "true"; // Mark as initialized
            }
        });
    });

})(); // IIFE to encapsulate the code and avoid global scope pollution