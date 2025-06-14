import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Progress } from "@/Components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Upload, Trash2, Save, Video, FileText, Eye, Lock } from "lucide-react";
import { COURSES_URL, MEDIA_URL } from "@/Components/url";
import styled from 'styled-components';

const LectureTab = () => {
  const [title, setTitle] = useState("");
  const [uploadInfo, setUploadInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [btnRvDisabled, setRvBtnDisabled] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const courseId = params.courseId;
  const lectureId = params.lectureId;

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const res = await axios.get(`${COURSES_URL}/${courseId}/lecture/${lectureId}`, {
          withCredentials: true,
        });
        console.log("Fetched lecture details:", res.data.lecture);
        setTitle(res.data.lecture.lectureTitle);
        setUploadInfo({
          videoUrl: res.data.lecture.videoUrl,
          publicId: res.data.lecture.publicId,
        });
        setIsFree(res.data.lecture.isPreviewFree);
        setBtnDisabled(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch lecture details");
      }
    };
    fetchLecture();
  }, [courseId, lectureId]);

  const fileChangeHandle = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      setMediaProgress(true);
      try {
        console.log('Uploading file...');
        const res = await axios.post(`${MEDIA_URL}/upload-video`, formData, {
          withCredentials: true,
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        if (res.data.success) {
          setUploadInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisabled(false);
          toast.success(res.data.message);
          console.log('File uploaded successfully:', res.data.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const handleUpdateLecture = async () => {
    const lectureData = {
      lectureTitle: title,
      videoInfo: {
        videoUrl: uploadInfo?.videoUrl,
        publicId: uploadInfo?.publicId,
      },
      isPreviewFree: isFree,
    };

    console.log('Editing lecture with data:', lectureData);
    console.log('Course ID:', courseId, 'Lecture ID:', lectureId);

    try {
      const res = await axios.post(`${COURSES_URL}/${courseId}/lecture/${lectureId}`, lectureData, {
        withCredentials: true,
      });
      console.log('Response:', res.data);
      toast.success(res.data.message);
      navigate(`/admin/course/${courseId}/lecture`);
    } catch (error) {
      console.error('Error details:', error.response || error.message || error);
      toast.error('An error occurred while updating the lecture');
    }
  };

  const removeLecture = async () => {
    console.log('Removing lecture with ID:', lectureId);
    try {
      const res = await axios.delete(`${COURSES_URL}/${courseId}/lecture/${lectureId}`, {
        withCredentials: true,
      });
      setRvBtnDisabled(false);
      console.log('Response:', res.data);
      toast.success(res.data.message);
      navigate(`/admin/course/${courseId}/lecture`);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while removing the lecture");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Edit Lecture</CardTitle>
                  <p className="text-blue-100 mt-1">Modify your course content</p>
                </div>
              </div>
              <Button 
                variant="destructive" 
                disabled={btnRvDisabled} 
                onClick={() => {
                  setRvBtnDisabled(true);
                  removeLecture();
                }}
                className="bg-red-500 hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {btnRvDisabled ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Lecture
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Title Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <Label className="text-lg font-semibold text-gray-700">Lecture Title</Label>
              </div>
              <Input 
                type="text" 
                placeholder="Ex. Introduction to JavaScript Fundamentals" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 shadow-sm"
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-600" />
                <Label className="text-lg font-semibold text-gray-700">Upload Content</Label>
                <span className="text-red-500 font-bold">*</span>
              </div>
              
              <div className="relative">
                <Input
                  onChange={fileChangeHandle}
                  type="file"
                  accept=".pdf,video/*,image/*"
                  className="h-16 border-2 border-dashed border-gray-300 hover:border-green-400 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all duration-200"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-gray-400 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  </div>
                </div>
              </div>

              {/* Current File Info */}
              {uploadInfo?.videoUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Video className="h-4 w-4" />
                    <span className="font-medium">Current file uploaded successfully</span>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Toggle Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isFree ? (
                    <Eye className="h-6 w-6 text-green-600" />
                  ) : (
                    <Lock className="h-6 w-6 text-orange-600" />
                  )}
                  <div>
                    <Label className="text-lg font-semibold text-gray-700">Preview Access</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {isFree ? "This lecture is free to preview" : "This lecture requires enrollment"}
                    </p>
                  </div>
                </div>
                
                <StyledWrapper>
                  <label className="switch">
                    <input  
                      type="checkbox"
                      id="isFree"
                      checked={isFree}
                      onChange={() => setIsFree(!isFree)}
                    />
                    <div className="slider">
                      <div className="circle">
                        <svg className="cross" xmlSpace="preserve" style={{enableBackground: 'new 0 0 512 512'}} viewBox="0 0 365.696 365.696" y={0} x={0} height={6} width={6} xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0" />
                          </g>
                        </svg>
                        <svg className="checkmark" xmlSpace="preserve" style={{enableBackground: 'new 0 0 512 512'}} viewBox="0 0 24 24" y={0} x={0} height={10} width={10} xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <path className data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </label>
                </StyledWrapper>
              </div>
            </div>

            {/* Upload Progress */}
            {mediaProgress && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="font-semibold text-blue-700">Uploading your content...</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-3" />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button 
                disabled={btnDisabled} 
                onClick={() => {
                  setBtnDisabled(true);
                  handleUpdateLecture();
                }}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl transform hover:scale-[1.02] transition-all duration-200 rounded-xl"
              >
                {btnDisabled ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" /> 
                    Updating Lecture...
                  </>
                ) : (
                  <>
                    <Save className="mr-3 h-5 w-5" />
                    Update Lecture
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .switch {
    /* switch */
    --switch-width: 54px;
    --switch-height: 28px;
    --switch-bg: rgb(131, 131, 131);
    --switch-checked-bg: rgb(34, 197, 94);
    --switch-offset: calc((var(--switch-height) - var(--circle-diameter)) / 2);
    --switch-transition: all .3s cubic-bezier(0.27, 0.2, 0.25, 1.51);
    /* circle */
    --circle-diameter: 22px;
    --circle-bg: #fff;
    --circle-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    --circle-checked-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    --circle-transition: var(--switch-transition);
    /* icon */
    --icon-transition: all .3s cubic-bezier(0.27, 0.2, 0.25, 1.51);
    --icon-cross-color: var(--switch-bg);
    --icon-cross-size: 8px;
    --icon-checkmark-color: var(--switch-checked-bg);
    --icon-checkmark-size: 12px;
    /* effect line */
    --effect-width: calc(var(--circle-diameter) / 2);
    --effect-height: calc(var(--effect-width) / 2 - 1px);
    --effect-bg: var(--circle-bg);
    --effect-border-radius: 2px;
    --effect-transition: all .3s ease-in-out;
  }

  .switch input {
    display: none;
  }

  .switch {
    display: inline-block;
  }

  .switch svg {
    -webkit-transition: var(--icon-transition);
    -o-transition: var(--icon-transition);
    transition: var(--icon-transition);
    position: absolute;
    height: auto;
  }

  .switch .checkmark {
    width: var(--icon-checkmark-size);
    color: var(--icon-checkmark-color);
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
  }

  .switch .cross {
    width: var(--icon-cross-size);
    color: var(--icon-cross-color);
  }

  .slider {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: var(--switch-width);
    height: var(--switch-height);
    background: var(--switch-bg);
    border-radius: 999px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    -webkit-transition: var(--switch-transition);
    -o-transition: var(--switch-transition);
    transition: var(--switch-transition);
    cursor: pointer;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .circle {
    width: var(--circle-diameter);
    height: var(--circle-diameter);
    background: var(--circle-bg);
    border-radius: inherit;
    -webkit-box-shadow: var(--circle-shadow);
    box-shadow: var(--circle-shadow);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-transition: var(--circle-transition);
    -o-transition: var(--circle-transition);
    transition: var(--circle-transition);
    z-index: 1;
    position: absolute;
    left: var(--switch-offset);
  }

  .slider::before {
    content: "";
    position: absolute;
    width: var(--effect-width);
    height: var(--effect-height);
    left: calc(var(--switch-offset) + (var(--effect-width) / 2));
    background: var(--effect-bg);
    border-radius: var(--effect-border-radius);
    -webkit-transition: var(--effect-transition);
    -o-transition: var(--effect-transition);
    transition: var(--effect-transition);
    opacity: 0.8;
  }

  /* actions */
  .switch input:checked+.slider {
    background: var(--switch-checked-bg);
    box-shadow: inset 0 2px 4px rgba(34, 197, 94, 0.2);
  }

  .switch input:checked+.slider .checkmark {
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }

  .switch input:checked+.slider .cross {
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
  }

  .switch input:checked+.slider::before {
    left: calc(100% - var(--effect-width) - (var(--effect-width) / 2) - var(--switch-offset));
  }

  .switch input:checked+.slider .circle {
    left: calc(100% - var(--circle-diameter) - var(--switch-offset));
    -webkit-box-shadow: var(--circle-checked-shadow);
    box-shadow: var(--circle-checked-shadow);
  }

  .switch:hover .slider {
    transform: scale(1.05);
  }

  .switch:hover .circle {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export default LectureTab;