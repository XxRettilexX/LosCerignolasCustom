import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '../../api';
import Header from '../../components/Header';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types/order';

const OrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { token, user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // 🧭 Caricamento ordini
    const fetchOrders = async () => {
        if (!token) return;
        try {
            const data = await api.fetchOrders(token);
            setOrders(data);
        } catch (error) {
            console.error('Errore caricamento ordini:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // 🔁 Aggiorna ordini ogni 1 secondo
        const interval = setInterval(fetchOrders, 1000);
        return () => clearInterval(interval);
    }, [token]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const renderStatus = (status: string) => {
        switch (status) {
            case 'Nuovo':
                return { color: Colors.secondary, label: '🆕 Nuovo' };
            case 'In Preparazione':
                return { color: '#E67E22', label: '🍳 In Preparazione' };
            case 'Pronto':
                return { color: '#2ECC71', label: '✅ Pronto' };
            case 'Completato':
                return { color: '#555', label: '🏁 Completato' };
            case 'Pagato':
                return { color: '#1E8449', label: '💳 Pagato' };
            default:
                return { color: '#999', label: status };
        }
    };

    const handlePayment = async (orderId: number) => {
        Alert.alert(
            'Conferma pagamento',
            'Vuoi procedere con il pagamento di questo ordine?',
            [
                { text: 'Annulla', style: 'cancel' },
                {
                    text: 'Paga ora',
                    onPress: async () => {
                        try {
                            const response = await api.payOrder(orderId, token || undefined);
                            if (response.success) {
                                Alert.alert('✅ Pagamento completato', 'L’ordine è stato rimosso.');
                                // Aggiorna la lista ordini dopo la rimozione
                                fetchOrders();
                            } else {
                                Alert.alert('❌ Errore', 'Impossibile completare il pagamento.');
                            }
                        } catch (error) {
                            console.error('Errore pagamento ordine:', error);
                            Alert.alert('Errore', 'Si è verificato un problema durante il pagamento.');
                        }
                    },
                },
            ]
        );
    };


    const renderItem = ({ item }: { item: Order }) => {
        const { color, label } = renderStatus(item.status);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('OrderDetail', { orderId: item.order_id })}
                activeOpacity={0.85}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.orderId}>
                        Ordine #{String(item.order_id).padStart(5, '0')}
                    </Text>
                    <Text style={[styles.status, { color }]}>{label}</Text>
                </View>

                <Text style={styles.total}>
                    💰 Totale: {Number(item.total_amount).toFixed(2)} €
                </Text>
                <Text style={styles.date}>
                    🕒 {new Date(item.created_at).toLocaleString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>

                {/* Mostra pulsante pagamento solo se non è già pagato */}
                {item.status !== 'Pagato' && item.status !== 'Completato' && (
                    <TouchableOpacity
                        style={styles.payButton}
                        onPress={() => handlePayment(item.order_id)}
                    >
                        <Text style={styles.payButtonText}>💳 Paga Ora</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    // 🔒 Se l'utente non è loggato
    if (!user) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loginPrompt}>
                    🔐 Effettua il login per visualizzare i tuoi ordini.
                </Text>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginButtonText}>Accedi</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ⏳ Schermata di caricamento
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Caricamento ordini...</Text>
            </View>
        );
    }

    // 📦 Lista ordini
    return (
        <View style={styles.container}>
            <Header title="I tuoi Ordini" />
            {orders.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>Non hai ancora effettuato ordini.</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => String(item.order_id)}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.primary]}
                            tintColor={Colors.primary}
                        />
                    }
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loadingText: {
        color: Colors.text,
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
    },
    emptyText: {
        color: Colors.secondary,
        fontSize: 16,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
        borderLeftWidth: 6,
        borderLeftColor: Colors.primary,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderId: { fontWeight: '800', fontSize: 16, color: Colors.secondary },
    status: { fontWeight: '600', fontSize: 14 },
    total: { color: Colors.text, fontWeight: '700', fontSize: 15, marginBottom: 6 },
    date: { color: '#555', fontSize: 13 },
    payButton: {
        marginTop: 12,
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    payButtonText: {
        color: Colors.secondary,
        fontWeight: '700',
        fontSize: 15,
    },
    loginPrompt: {
        color: Colors.text,
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 30,
    },
    loginButtonText: {
        color: Colors.secondary,
        fontWeight: '700',
        fontSize: 16,
    },
});

export default OrdersScreen;
