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

                <div className="journal-page shadow-page pr-6 py-6 md:pr-8 md:py-8">

                    <p className="text-plum text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                        Patterns
                    </p>
                    <h2 className="font-display text-2xl text-ink-950 mb-5">
                        Mood analytics
                    </h2>

                    <div className="w-56 mx-auto">
                        <Pie data={props.chartData} />
                    </div>

                </div>

            </div>

            <button
                onClick={props.downloadPDF}
                className="mt-6 w-full bg-ink-800 hover:bg-ink-700 border border-white/10 text-paper py-3.5 rounded-xl font-semibold transition"
            >
                Download report
            </button>

        </DashboardLayout>

    );

}

export default Dashboard;