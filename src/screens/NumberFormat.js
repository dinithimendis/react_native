import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    ScrollView,
} from 'react-native';
import numberToWords from 'number-to-words';

export default function NumberFormat() {
    const [inputFormat, setInputFormat] = useState('decimal');
    const [inputNumber, setInputNumber] = useState('');
    const [decimal, setDecimal] = useState('');
    const [binary, setBinary] = useState('');
    const [octal, setOctal] = useState('');
    const [hexadecimal, setHexadecimal] = useState('');
    const [rounddigit, setRoundDigit] = useState('');
    const [rounddigitindex, setRoundDigitindex] = useState('2');
    const [significantno, setSignificantno] = useState('');
    const [significantnoindex, setSignificantnoindex] = useState('2');
    const [integer, setInteger] = useState('');
    const [numerator, setNumerator] = useState('0');
    const [denominator, setDenominator] = useState('0');
    const [inword, setInword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [options] = useState([
        { label: 'Binary', value: 'binary' },
        { label: 'Decimal', value: 'decimal' },
        { label: 'Octal', value: 'octal' },
        { label: 'Hexadecimal', value: 'hexadecimal' },
    ]);

    const conversionFunctions = {
        binary: (input) => parseInt(input, 2),
        octal: (input) => parseInt(input, 8),
        hexadecimal: (input) => parseInt(input, 16),
        decimal: (input) => parseInt(input, 10),
    };

    const handleConversion = () => {
        const decimalValue = conversionFunctions[inputFormat](inputNumber);
        setDecimal(decimalValue);
        setInteger(Math.floor(decimalValue).toString());
        setBinary(Math.floor(decimalValue).toString(2));
        setOctal(Math.floor(decimalValue).toString(8));
        setHexadecimal(Math.floor(decimalValue).toString(16).toUpperCase());

        if (decimalValue <= 1000000000000000) {
            setInword(numberToWords.toWords(decimalValue));
        } else {
            setInword("Over Limit (Max-Limit: 1000000000000000)");
        }

        setRoundDigit(roundToKthInteger(parseFloat(decimalValue, 10), parseInt(rounddigitindex, 10)));

        if (inputFormat === 'decimal' && parseFloat(decimal, 10) - decimalValue !== 0) {
            const result = floatToFraction(parseFloat(decimal, 10) - decimalValue);
            setNumerator(result.numerator.toString());
            setDenominator(result.denominator.toString());
        } else {
            setNumerator('0');
            setDenominator('0');
        }

        if (inputFormat === 'decimal') {
            setSignificantno(roundToSignificantDigits(parseFloat(decimal, 10), parseInt(significantnoindex, 10)));
        } else {
            setSignificantno(roundToSignificantDigits(parseFloat(decimalValue, 10), parseInt(significantnoindex, 10)));
        }
    };

    const floatToFraction = (number) => {
        const tolerance = 0.000001;
        let numerator = 1;
        let denominator = 1;
        let error = number - numerator / denominator;

        while (Math.abs(error) > tolerance) {
            if (error > 0) numerator++;
            else denominator++;
            error = number - numerator / denominator;
        }
        return { numerator, denominator };
    };

    const roundToKthInteger = (number, k) => {
        const multiplier = Math.pow(10, k);
        return Math.round(number * multiplier) / multiplier;
    };

    const roundToSignificantDigits = (number, significantDigits) => {
        if (significantDigits <= 0) return 0;
        const multiplier = Math.pow(10, significantDigits - Math.floor(Math.log10(Math.abs(number))) - 1);
        return Math.round(number * multiplier) / multiplier;
    };

    const renderOptionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
                setInputFormat(item.value);
                setModalVisible(false);
            }}
        >
            <Text style={styles.optionText}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>Number Format Converter</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
                    <Text>{inputFormat}</Text>
                </TouchableOpacity>
                <View style={styles.section}>
                    <Text style={styles.label}>Enter {inputFormat} Number</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            keyboardType={inputFormat !== 'decimal' ? 'default' : 'numeric'}
                            value={inputNumber}
                            onChangeText={(text) => {
                                if (inputFormat === 'decimal') {
                                    setDecimal(text);
                                    setInputNumber(text);
                                } else {
                                    setInputNumber(text);
                                }
                            }}
                        />
                        <TouchableOpacity style={styles.btn} onPress={handleConversion}>
                            <Text style={styles.btnText}>Convert</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.resultSection}>
                    <Text style={styles.resultHeader}>Integer Number</Text>
                    <Text style={styles.resultText}>{integer}</Text>
                </View>
                <View style={styles.resultSection}>
                    <Text style={styles.resultHeader}>Binary Format (Base-2) of Integer {integer}</Text>
                    <Text style={styles.resultText}>{binary}</Text>
                </View>
                <View style={styles.resultSection}>
                    <Text style={styles.resultHeader}>Octal Format (Base-8) of Integer {integer}</Text>
                    <Text style={styles.resultText}>{octal}</Text>
                </View>
                <View style={styles.resultSection}>
                    <Text style={styles.resultHeader}>Hexadecimal Format (Base-16) of Integer {integer}</Text>
                    <Text style={styles.resultText}>{hexadecimal}</Text>
                </View>
                <View style={styles.resultSection}>
                    <Text style={styles.resultHeader}>In Words of Integer {integer}</Text>
                    <Text style={styles.resultText}>{inword}</Text>
                </View>
                <View style={styles.resultSection}>
                    <Text style={styles.resultHeader}>Rounded Number</Text>
                    <Text style={styles.resultText}>{rounddigit}</Text>
                </View>
                <View style={styles.resultSection}>
                    <Text style={styles.resultHeader}>Significant Number</Text>
                    <Text style={styles.resultText}>{significantno}</Text>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={options}
                                renderItem={renderOptionItem}
                                keyExtractor={(item) => item.value}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold',
        margin: 20,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 4,
        padding: 8,
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    section: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 7,
        width: '100%',
        maxWidth: 500,
        padding: 20,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 4,
        marginRight: 5,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 15,
        color: '#000',
        fontWeight: 'bold',
    },
    btn: {
        fontSize: 16,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#28a745',
        marginLeft: 5,
        shadowOffset: { width: 0, height: 6 },
        shadowColor: 'grey',
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    btnText: {
        fontSize: 16,
        padding: 8,
        color: '#fff',
        fontWeight: 'bold',
    },
    resultSection: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 7,
        padding: 20,
        width: '100%',
        maxWidth: 500,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: 'grey',
        shadowOpacity: 1,
        shadowRadius: 13,
    },
    resultHeader: {
        fontSize: 18,
        marginBottom: 10,
    },
    resultText: {
        fontSize: 19,
        color: 'red',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    optionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ced4da',
    },
    optionText: {
        fontSize: 16,
    },
});
