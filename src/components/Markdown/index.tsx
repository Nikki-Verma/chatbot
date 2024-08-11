import React from 'react';
import { ScrollView, StyleSheet, View, Text, ViewStyle, TextStyle, Clipboard, Alert } from 'react-native';
import Markdown from 'react-native-markdown-display';
import matter from 'gray-matter';

// Define the interface for the front matter
interface FrontMatter {
    title: string;
    date: string;
    description: string;
}

// Define the props for the component
interface MarkdownComponentProps {
    markdown: any;
    markdownStyleOverride?: boolean;
}

const MarkdownComponent: React.FC<MarkdownComponentProps> = ({
    markdown,
    markdownStyleOverride = true,
}) => {

    // Parse front matter if it exists
    const { data, content } = matter(markdown);
    const frontMatter = data as FrontMatter;

    return (
        <View style={styles.container}>
            <Markdown
                style={markdownStyleOverride ? markdownStyles : undefined}
                onLinkPress={(url) => {
                    Clipboard.setString(url);
                    Alert.alert(`Copied to clipboard: ${url}`);
                    return true;
                }}
                // You can further customize rendering for specific elements
                rules={{
                    pre: (node, children) => (
                        <View style={styles.preContainer}>
                            <Text style={styles.preText}>{children}</Text>
                        </View>
                    ),
                    a: (node, children) => (
                        <Text style={styles.link} onPress={() => Clipboard.setString(node.attributes.href)}>
                            {children}
                        </Text>
                    ),
                    table: (node, children) => (
                        <View style={styles.tableContainer}>
                            {children}
                        </View>
                    ),
                }}
            >
                {content}
            </Markdown>
        </View>
    );
};

type Styles = {
    container: ViewStyle;
    header: ViewStyle;
    title: TextStyle;
    date: TextStyle;
    description: TextStyle;
    preContainer: ViewStyle;
    preText: TextStyle;
    link: TextStyle;
    tableContainer: ViewStyle;
};

const styles = StyleSheet.create({
    container: {
        // padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    description: {
        fontSize: 16,
        color: '#333',
    },
    preContainer: {
        backgroundColor: '#f9fafb',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    preText: {
        fontSize: 14,
        color: '#555',
        fontFamily: 'monospace',
    },
    link: {
        color: '#1e90ff',
        textDecorationLine: 'underline',
    },
    tableContainer: {
        marginVertical: 10,
    },
});

const markdownStyles = {
    body: {
        fontSize: 16,
        color: '#333',
    } as TextStyle,
    heading1: {
        fontSize: 24,
        fontWeight: 'bold', // Corrected to use a valid fontWeight value
        color: '#000',
    } as TextStyle,
    link: {
        color: '#1e90ff',
        textDecorationLine: 'underline',
    } as TextStyle,
};

export default MarkdownComponent;