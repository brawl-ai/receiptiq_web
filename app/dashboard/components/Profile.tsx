import { Paper, Text, Title } from "@mantine/core";
import { useAuthContext } from "../../stores/auth_store";


export default function Profile() {
    const user = useAuthContext((s) => s.user);

    return <Paper>
        <Title>Manage Your Profile</Title>
        <Text>First Name: {user.first_name}</Text>
        <Text>Last Name: {user.last_name}</Text>
        <Text>Email: {user.email}</Text>
    </Paper>
}