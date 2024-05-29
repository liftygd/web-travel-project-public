import Header from "./components/info/Header";
import MainPage from "./components/pages/MainPage";
import ReviewsPage from "./components/pages/ReviewsPage";
import RoutesPage from "./components/pages/RoutesPage";
import Footer from "./components/info/Footer";

import LoginPage from "./components/user/LoginPage";
import RegisterPage from "./components/user/RegisterPage";
import EmailVerificationPage from "./components/user/EmailVerification";
import EmailVerificationSendPage from "./components/user/EmailVerificationSend";

import ForgotMain from "./components/user/credentials_recovery/ForgotMain";
import ForgotChoice from "./components/user/credentials_recovery/ForgotChoice";
import ForgotSendPage from "./components/user/credentials_recovery/ForgotSend";
import ForgotResetUsernamePage from "./components/user/credentials_recovery/ForgotResetUsername";
import ForgotResetPasswordPage from "./components/user/credentials_recovery/ForgotResetPassword";
import ForgotResetComplete from "./components/user/credentials_recovery/ForgotResetComplete";

import ReviewCreateNewPage from "./components/reviews/ReviewCreateNew";
import ReviewEditPage from "./components/reviews/ReviewEdit";
import MyReviewsPage from "./components/pages/MyReviewsPage";
import ReviewsReadPage from "./components/reviews/ReviewsReadPage";

import MyRoutesPage from "./components/pages/MyRoutesPage";
import RoutesReadPage from "./components/routes/RouteReadPage";
import RouteCreateNewPage from "./components/routes/RouteCreateNew";
import RouteEdit from "./components/routes/RouteEdit";

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./main.css";

function App() {
  return (
    <>
      <div class="fullScreen mainDisplay">
        <Router>
          
          <div class="fullScreen" style={{ flex:1 }}>
            <Header/>
          </div>

          <div class="fullScreen">
            <Routes>
              <Route path="/" element={<MainPage/>} />

              <Route path="/routes/:pageNumber" element={ <RoutesPage/> } />
              <Route path="/routes/my/:pageNumber" element={ <MyRoutesPage/> } />
              <Route path="/routes/read/:routeID/:commentsPage" element={ <RoutesReadPage/> } />
              <Route path="/routes/edit/:routeID" element={ <RouteEdit/> } />
              <Route path="/routes/create" element={ <RouteCreateNewPage/> } />

              <Route path="/reviews/:pageNumber" element={ <ReviewsPage/> } />
              <Route path="/reviews/my/:pageNumber" element={ <MyReviewsPage/> } />
              <Route path="/reviews/create" element={ <ReviewCreateNewPage/> } />
              <Route path="/reviews/edit/:reviewID" element={ <ReviewEditPage/> } />
              <Route path="/reviews/read/:reviewID/:commentsPage" element={ <ReviewsReadPage/> } />

              <Route path="/login" element={ <LoginPage/> } />
              <Route path="/register" element={ <RegisterPage/> } />

              <Route path="/register/verify" element={ <EmailVerificationSendPage/> } />
              <Route path="/verifyUserEmail/:userName/:token" element={ <EmailVerificationPage/> } />

              <Route path="/login/forgot" element={ <ForgotMain/> } />
              <Route path="/login/forgot/:email" element={ <ForgotChoice/> } />
              <Route path="/login/forgot/:email/sent" element={ <ForgotSendPage/> } />
              <Route path="/login/resetUserName/:email/:token" element={ <ForgotResetUsernamePage/> } />
              <Route path="/login/resetPassword/:email/:token" element={ <ForgotResetPasswordPage/> } />
              <Route path="/login/forgot/complete" element={ <ForgotResetComplete/> } />
            </Routes>
          </div>

          <div class="fullScreen">
            <Footer/>
          </div>

        </Router>
      </div>
    </>
  );
}

export default App;
