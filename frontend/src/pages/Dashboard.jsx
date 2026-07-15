import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import InputCard from "../components/InputCard";
import ResultCard from "../components/ResultCard";
import HistoryCard from "../components/HistoryCard";
import { Pie } from "react-chartjs-2";

function Dashboard(props) {

    return (

        <DashboardLayout>

            <Header
                streak={props.streak}
                onLogout={props.onLogout}
            />

            <InputCard
                text={props.text}
                setText={props.setText}
                handleSubmit={props.handleSubmit}
                loading={props.loading}
            />

            <ResultCard
                result={props.result}
            />

            <div className="grid md:grid-cols-2 gap-6">

                <HistoryCard
                    logs={props.logs}
                />

                <div className="bg-white p-4 rounded-2xl shadow">

                    <h2 className="text-xl font-semibold mb-3">
                        Mood Analytics
                    </h2>

                    <div className="w-64 mx-auto">
                        <Pie data={props.chartData} />
                    </div>

                </div>

            </div>

            <button
                onClick={props.downloadPDF}
                className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg"
            >
                Download Report 📄
            </button>

        </DashboardLayout>

    );

}

export default Dashboard;